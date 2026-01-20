import { PUBLIC_CLIENT_PB } from '$env/static/public';
import { getPublicPocketBase, getAdminPocketBase } from '$lib/pocketbase_utils';
import { Card } from './types';


export async function getCard(cardId: string): Promise<Card> {
    const pb = await getPublicPocketBase();

    const card = await pb.collection('ac_cards').getOne(cardId);
    return recordToCard(card);
}

export async function getAllCards(): Promise<Array<Card>> {
    const pb = await getPublicPocketBase();

    const cards = await pb.collection('ac_cards').getFullList();

    const families = await pb.collection('ac_families').getFullList();
    const familyMap = new Map(families.map(f => [f.id, f.name]));

    const cardObjects = cards.map(card => recordToCardWithFamilyMap(card, familyMap));

    const normalizeString = (str: string) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    return cardObjects.sort((a, b) => {
        const familyA = a.family;
        const familyB = b.family;

        // "Spécial" is always first
        if (familyA === 'Spécial' && familyB !== 'Spécial') return -1;
        if (familyA !== 'Spécial' && familyB === 'Spécial') return 1;

        // Sort with accent É for écureil is after Z
        return normalizeString(familyA).localeCompare(normalizeString(familyB));
    });
}

export async function getRandomCards(nCards: number): Promise<Array<Card>> {
    const pb = await getPublicPocketBase();

    const cards = await pb.collection('ac_cards').getList(1, nCards, {
        sort: '@random',
    });

    const families = await pb.collection('ac_families').getFullList();
    const familyMap = new Map(families.map(f => [f.id, f.name]));

    return cards.items.map(card => recordToCardWithFamilyMap(card, familyMap));
}

export async function getCardIdMap(): Promise<Map<string, number>> {
    const pb = await getPublicPocketBase();

    const cards = await pb.collection('ac_cards').getFullList();
    const cardMap: Map<string, number> = new Map();

    for (const card of cards) {
        cardMap.set(card.id, card.card_id);
    }

    return cardMap
}


export async function recordToCard(record: any): Promise<Card> {
    const pb = await getPublicPocketBase();
    const family = await pb.collection('ac_families').getOne(record.family);

    return {
        id: record.card_id,
        name: record.name,
        wiki_url: record.wiki_url,
        family: family.name,
        image_url: `${PUBLIC_CLIENT_PB}/api/files/${record.collectionId}/${record.id}/${record.image}`,
        credit: record.credit,
    };
}

function recordToCardWithFamilyMap(record: any, familyMap: Map<string, string>): Card {
    return {
        id: record.card_id,
        name: record.name,
        wiki_url: record.wiki_url,
        family: familyMap.get(record.family) || 'Unknown',
        image_url: `${PUBLIC_CLIENT_PB}/api/files/${record.collectionId}/${record.id}/${record.image}`,
        credit: record.credit,
    };
}