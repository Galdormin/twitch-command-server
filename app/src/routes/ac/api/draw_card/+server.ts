import type { RequestHandler } from './$types';
import { getUserFromToken } from '$lib/token_validation'
import { getRandomCards } from '$lib/ac/utils'
import { Card } from '$lib/ac/types';
import { getAdminPocketBase } from '$lib/pocketbase_utils';


export const GET: RequestHandler = async({ request, url }) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const streamer = await getUserFromToken(token, 'ac_tokens');

        if (!streamer) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
        }

        const amount = Number(url.searchParams.get("amount") ?? "1");
        const cards = await getRandomCards(amount);

        if (url.searchParams.has("twitch_id")) {
            const twitchId = Number(url.searchParams.get("twitch_id"));
            await drawCardForUser(cards, twitchId, streamer);
        }

        return new Response(JSON.stringify(cards), { status: 200 });
    } catch (err) {
        console.error('Error:', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
};


async function drawCardForUser(cards: Card[], twitch_id: number, streamer: User): Promise<void> {
    const pb = await getAdminPocketBase();
    
    const cardIds = cards.map(card => card.id);
    const filter = cardIds.map(id => `card_id = "${id}"`).join(' || ');
    const card_records = await pb.collection('ac_cards').getFullList({ filter });

    await pb.collection('ac_user_cards').create({
        twitch_id: twitch_id,
        streamer: streamer.id,
        cards: card_records.map(record => record.id),
    });
}