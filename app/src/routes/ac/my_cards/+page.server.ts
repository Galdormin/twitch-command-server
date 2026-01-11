import type { RecordModel } from 'pocketbase';
import type { PageServerLoad } from './$types';
import { getAllCards, getCardIdMap } from '$lib/ac/utils';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const cardMap = await getCardIdMap()
        const drawCards = await locals.pb.collection('ac_user_cards').getFullList({
            filter: `twitchId = ${locals.user.twitch_id}`
        });

        const allCards = await getAllCards();
        const userCards: Map<number, number> = new Map();
        for (const draw of drawCards) {
            for (const id of draw.cards) {
                const cardId = cardMap.get(id) ?? -1;
                userCards.set(cardId, (userCards.get(cardId) || 0) + 1);
            }
        }

        return {
            user: locals.user,
            cards: allCards,
            user_cards: userCards,
        };
    } catch (error) {
        console.error('Error loading cards:', error);
        return {
            user: locals.user,
            cards: [],
            user_cards: new Map(),
        };
    }
};

async function getUserCards(twitch_id: number): Promise<Map<number, number>> {

}

function parseCards(raw_cards: RecordModel[]): Map<string, number> {
    const cardCounts: Map<string, number> = new Map();
    for (const raw_card of raw_cards) {
        for (const cardId of raw_card.card) {
            cardCounts.set(cardId, (cardCounts.get(cardId) || 0) + 1);
        }
    }

    return cardCounts;
}