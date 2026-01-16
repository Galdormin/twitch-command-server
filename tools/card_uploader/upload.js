import "dotenv/config";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import PocketBase from "pocketbase";
import { File } from "node:buffer";

const PB_URL = process.env.PB_URL;
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

const CSV_PATH = process.env.CSV_PATH || "./cards.csv";
const CARDS_DIR = process.env.CARDS_DIR || "./cards";
const PB_CONCURRENCY = Number(process.env.PB_CONCURRENCY || "3");

const PB_CARDS_COLLECTION = process.env.PB_CARDS_COLLECTION || "ac_cards";
const PB_FAMILIES_COLLECTION = process.env.PB_FAMILIES_COLLECTION || "ac_families";

// champs
const PB_FAMILY_NAME_FIELD = process.env.PB_FAMILY_NAME_FIELD || "name";
const PB_CARD_FAMILY_FIELD = process.env.PB_CARD_FAMILY_FIELD || "family";
const PB_IMAGE_FIELD = process.env.PB_IMAGE_FIELD || "image";

// relations / fichiers multi ?
const RELATION_IS_MULTI = String(process.env.RELATION_IS_MULTI || "false").toLowerCase() === "true";
const IMAGE_IS_MULTI = String(process.env.IMAGE_IS_MULTI || "false").toLowerCase() === "true";

if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    console.error("❌ .env manquant: PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD");
    process.exit(1);
}

const pb = new PocketBase(PB_URL);

// --- utils ---
const s = (v) => (v ?? "").toString().trim();
const normalizeHeader = (h) => s(h).toLowerCase();

function existsFile(p) {
    try {
        return fs.existsSync(p) && fs.statSync(p).isFile();
    } catch {
        return false;
    }
}

function resolveImagePath(imageValue) {
    if (!imageValue) return null;
    return path.resolve(CARDS_DIR, s(imageValue));
}

// capitalisation identique à ce que tu veux
function capitalizeFamily(input) {
    const raw = s(input);
    if (!raw) return "";
    const cleaned = raw.replace(/\s+/g, " ").toLowerCase();
    const parts = cleaned.split(/([ \-'])/g);
    const capWord = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    return parts.map((p) => (p === " " || p === "-" || p === "'" ? p : capWord(p))).join("").trim();
}

function validateRow(row, lineNo) {
    const id = s(row.id);
    const nom = s(row.nom);
    const familleRaw = s(row.famille);
    const wiki = s(row.wiki);
    const credit = s(row.credit);
    const imagePath = resolveImagePath(row.image);

    const missing = [];
    if (!id) missing.push("id");
    if (!nom) missing.push("nom");
    if (!familleRaw) missing.push("famille");
    if (!imagePath) missing.push("image");

    if (missing.length) return { ok: false, error: `Ligne ${lineNo}: champs manquants: ${missing.join(", ")}` };
    if (!existsFile(imagePath)) return { ok: false, error: `Ligne ${lineNo}: image introuvable: ${imagePath}` };

    return {
        ok: true,
        data: {
            id,
            nom,
            famille: capitalizeFamily(familleRaw),
            wiki,
            credit,
            imagePath,
        },
    };
}

async function runWithConcurrency(items, worker, limit) {
    const results = new Array(items.length);
    let i = 0;
    let active = 0;

    return new Promise((resolve) => {
        const next = () => {
            while (active < limit && i < items.length) {
                const idx = i++;
                active++;
                Promise.resolve(worker(items[idx], idx))
                    .then((r) => (results[idx] = { ok: true, result: r }))
                    .catch((e) => (results[idx] = { ok: false, error: e }))
                    .finally(() => {
                        active--;
                        if (i >= items.length && active === 0) resolve(results);
                        else next();
                    });
            }
        };
        next();
    });
}

// Charge toutes les familles existantes et mappe NameCapitalized -> id
async function loadFamiliesMap() {
    const list = await pb.collection(PB_FAMILIES_COLLECTION).getFullList({
        batch: 200,
        sort: PB_FAMILY_NAME_FIELD,
    });

    const map = new Map();
    for (const rec of list) {
        const name = capitalizeFamily(rec[PB_FAMILY_NAME_FIELD]);
        if (name) map.set(name, rec.id);
    }
    return map;
}

// Fabrique un File (comme le navigateur) à partir d’un chemin
async function fileFromPath(filePath) {
    const buf = await fsp.readFile(filePath);
    const filename = path.basename(filePath);
    return new File([buf], filename);
}

async function main() {
    // Auth superuser
    await pb.collection("_superusers").authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log("Superuser auth OK:", pb.authStore.isValid);

    const familiesMap = await loadFamiliesMap();
    console.log(`👨‍👩‍👧‍👦 Familles chargées: ${familiesMap.size}`);

    // Parse CSV
    const csvText = await fsp.readFile(path.resolve(CSV_PATH), "utf8");
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: normalizeHeader,
    });

    if (parsed.errors?.length) {
        console.error("❌ Erreurs parsing CSV:", parsed.errors);
        process.exit(1);
    }

    const rows = parsed.data ?? [];
    if (!rows.length) {
        console.error("❌ CSV vide.");
        process.exit(1);
    }

    const valid = [];
    for (let i = 0; i < rows.length; i++) {
        const lineNo = i + 2;
        const v = validateRow(rows[i], lineNo);
        if (!v.ok) {
            console.warn("⚠️  Skip:", v.error);
            continue;
        }
        valid.push(v.data);
    }

    console.log(`📄 Lignes totales: ${rows.length}`);
    console.log(`✅ Lignes valides: ${valid.length}`);
    console.log(`🗂️  Images depuis: ${path.resolve(CARDS_DIR)}`);
    console.log(`🎯 Cards: ${PB_CARDS_COLLECTION}`);
    console.log(`🔗 family multi=${RELATION_IS_MULTI}, image multi=${IMAGE_IS_MULTI}\n`);

    // Vérifie familles manquantes
    const missing = [...new Set(valid.map((c) => c.famille).filter((f) => !familiesMap.has(f)))];
    if (missing.length) {
        console.error("❌ Familles du CSV absentes dans la DB (exemples):");
        missing.slice(0, 50).forEach((f) => console.error(" -", f));
        if (missing.length > 50) console.error(`... +${missing.length - 50} autres`);
        process.exit(1);
    }

    const results = await runWithConcurrency(
        valid,
        async (card, idx) => {
            const familyId = familiesMap.get(card.famille);
            const imgFile = await fileFromPath(card.imagePath);

            // IMPORTANT: on envoie un FormData EXACTEMENT comme ton back/front
            const fd = new FormData();
            fd.append("card_id", card.id);
            fd.append("name", card.nom);
            fd.append(PB_CARD_FAMILY_FIELD, RELATION_IS_MULTI ? JSON.stringify([familyId]) : familyId);
            fd.append("wiki", card.wiki || "");
            fd.append("credit", card.credit || "");
            fd.append(PB_IMAGE_FIELD, imgFile);

            if (IMAGE_IS_MULTI) {
                // si le champ image est multi-file, PocketBase accepte aussi plusieurs append
                // ici on append une seule image, donc rien d'autre à faire
            }

            try {
                const rec = await pb.collection(PB_CARDS_COLLECTION).create(fd);
                console.log(`✅ [${idx + 1}/${valid.length}] card_id=${card.id} OK`);
                return rec.id;
            } catch (e) {
                console.error(`❌ [${idx + 1}/${valid.length}] card_id=${card.id} FAILED`);
                console.error("message:", e?.message);
                if (e?.status) console.error("status:", e.status);
                if (e?.data) console.error("data:", JSON.stringify(e.data, null, 2));
                throw e;
            }
        },
        PB_CONCURRENCY
    );

    const ok = results.filter((r) => r?.ok).length;
    const ko = results.length - ok;

    console.log("\n--- Résumé ---");
    console.log(`✅ OK: ${ok}`);
    console.log(`❌ KO: ${ko}`);

    if (ko) process.exitCode = 1;
}

main().catch((e) => {
    console.error("❌ Erreur fatale:", e?.message || e);
    if (e?.status) console.error("Status:", e.status);
    if (e?.data) console.error("Data:", JSON.stringify(e.data, null, 2));
    process.exit(1);
});
