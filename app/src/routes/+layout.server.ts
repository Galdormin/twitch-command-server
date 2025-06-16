import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, route }) => {
    return {
		user: locals.user,
		route: route,
	};
}) satisfies LayoutServerLoad;