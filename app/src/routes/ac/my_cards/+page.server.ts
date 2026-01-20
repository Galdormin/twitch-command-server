import type { RecordModel } from 'pocketbase';
import type { PageServerLoad } from './$types';
import { getAllCards, getCardIdMap } from '$lib/ac/utils';
import { getAdminPocketBase } from '$lib/pocketbase_utils';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const cardMap = await getCardIdMap()
        const drawCards = await locals.pb.collection('ac_user_cards').getFullList({
            filter: `twitchId = ${locals.user.twitch_id}`
        });

        const allCards = await getAllCards();
        const userCards: Map<number, number> = new Map();
        const userCardsByStreamer: Map<string, { cards: Map<number, number>, streamerName: string }> = new Map();

        // Get admin PocketBase to fetch streamer details
        const adminPb = await getAdminPocketBase();

        for (const draw of drawCards) {
            const streamerId = draw.streamer;

            // Fetch streamer info if not already in the map
            if (!userCardsByStreamer.has(streamerId)) {
                try {
                    const streamerUser = await adminPb.collection('users').getOne(streamerId);
                    const streamerName = streamerUser.twitchName || streamerUser.username || 'Unknown';

                    userCardsByStreamer.set(streamerId, {
                        cards: new Map(),
                        streamerName: streamerName
                    });
                } catch (error) {
                    console.error(`Error fetching streamer ${streamerId}:`, error);
                    userCardsByStreamer.set(streamerId, {
                        cards: new Map(),
                        streamerName: 'Unknown'
                    });
                }
            }

            const streamerData = userCardsByStreamer.get(streamerId)!;;

            for (const id of draw.cards) {
                const cardId = cardMap.get(id) ?? -1;
                userCards.set(cardId, (userCards.get(cardId) || 0) + 1);
                streamerData.cards.set(cardId, (streamerData.cards.get(cardId) || 0) + 1);
            }
        }

        // Get list of streamers from user's cards
        const allStreamers = Array.from(userCardsByStreamer.entries()).map(([id, data]) => ({
            id: id,
            username: data.streamerName
        }));

        return {
            user: locals.user,
            cards: allCards,
            user_cards: userCards,
            user_cards_by_streamer: userCardsByStreamer,
            streamers: allStreamers
        };
    } catch (error) {
        console.error('Error loading cards:', error);
        return {
            user: locals.user,
            cards: [],
            user_cards: new Map(),
            user_cards_by_streamer: new Map(),
            streamers: []
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