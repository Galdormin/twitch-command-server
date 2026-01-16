import "dotenv/config";
import PocketBase from "pocketbase";

const PB_URL = process.env.PB_URL;
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

const PB_CARDS_COLLECTION = process.env.PB_CARDS_COLLECTION || "ac_cards";
const PB_CARD_NAME_FIELD = process.env.PB_CARD_NAME_FIELD || "name";
const PB_CONCURRENCY = Number(process.env.PB_CONCURRENCY || "5");

if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    console.error("❌ .env manquant: PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD");
    process.exit(1);
}

const pb = new PocketBase(PB_URL);

const s = (v) => (v ?? "").toString().trim();

/**
 * Title-case "friendly":
 * - lowercases then capitalizes each token
 * - preserves separators space/hyphen/apostrophe
 * Examples:
 *  "isabelle" -> "Isabelle"
 *  "tom nook" -> "Tom Nook"
 *  "o'connor" -> "O'Connor"
 *  "van-der waals" -> "Van-Der Waals"
 */
function titleCaseName(input) {
    const raw = s(input);
    if (!raw) return "";
    const cleaned = raw.replace(/\s+/g, " ").toLowerCase();
    const parts = cleaned.split(/([ \-'])/g);

    const capWord = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);

    return parts.map((p) => (p === " " || p === "-" || p === "'" ? p : capWord(p))).join("").trim();
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

async function main() {
    await pb.collection("_superusers").authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
    console.log("Superuser auth OK:", pb.authStore.isValid);

    // Récupère tous les cards (attention si énorme volume)
    const cards = await pb.collection(PB_CARDS_COLLECTION).getFullList({
        batch: 200,
        fields: `id,${PB_CARD_NAME_FIELD},card_id`,
        sort: "card_id",
    });

    console.log(`📦 Cartes chargées: ${cards.length}`);

    // Prépare les updates nécessaires
    const toUpdate = [];
    for (const c of cards) {
        const current = s(c[PB_CARD_NAME_FIELD]);
        const desired = titleCaseName(current);
        if (current && desired && current !== desired) {
            toUpdate.push({ id: c.id, card_id: c.card_id, from: current, to: desired });
        }
    }

    console.log(`✏️  À mettre à jour: ${toUpdate.length}`);

    const results = await runWithConcurrency(
        toUpdate,
        async (u, idx) => {
            try {
                await pb.collection(PB_CARDS_COLLECTION).update(u.id, {
                    [PB_CARD_NAME_FIELD]: u.to,
                });
                console.log(`✅ [${idx + 1}/${toUpdate.length}] card_id=${u.card_id} "${u.from}" -> "${u.to}"`);
                return true;
            } catch (e) {
                console.error(`❌ [${idx + 1}/${toUpdate.length}] card_id=${u.card_id} FAILED`);
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
    console.log(`ℹ️  Inchangés: ${cards.length - toUpdate.length}`);

    if (ko) process.exitCode = 1;
}

main().catch((e) => {
    console.error("❌ Erreur fatale:", e?.message || e);
    if (e?.status) console.error("Status:", e.status);
    if (e?.data) console.error("Data:", JSON.stringify(e.data, null, 2));
    process.exit(1);
});
