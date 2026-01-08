import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	console.log("route /:", locals.user);

	return {
		user: locals.user,
	};
}) satisfies PageServerLoad;
