import type { PageServerLoad } from './$types';
import { getAllCards } from '$lib/ac/utils';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const families = await locals.pb.collection('ac_families').getFullList();
        const cards = await getAllCards();

        return {
            user: locals.user,
            cards: cards,
            families: families.map(family => ({
                id: family.id,
                name: family.name
            }))
        };
    } catch (error) {
        console.error('Error loading cards:', error);
        return {
            cards: [],
            families: []
        };
    }
};
