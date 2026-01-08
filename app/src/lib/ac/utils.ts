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

    const cards = await pb.collection('ac_cards').getFullList({
        sort: "card_id",
    });

    return Promise.all(cards.map(card => recordToCard(card)));
}

export async function getRandomCards(nCards: number): Promise<Array<Card>> {
    const pb = await getPublicPocketBase();

    const cards = await pb.collection('ac_cards').getList(1, nCards,{
        sort: '@random',
    });

    return await Promise.all(cards.items.map(card => recordToCard(card)));
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