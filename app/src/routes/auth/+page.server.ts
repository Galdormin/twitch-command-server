import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getAdminPocketBase } from '$lib/pocketbase_utils';

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		console.log('form:', form);

		const token = form.get('token');
		const email = form.get('email');
		const twitchName = form.get('twitch_name');
		const twitchId = form.get('twitch_id');

		// Verify if the token is valid
		if (!token || typeof token !== 'string') {
			throw redirect(303, '/auth');
		}
		cookies.set('pb_auth', JSON.stringify({ token: token }), { path: '/' });

		// Update the user with the twitch name and id
		const pb = await getAdminPocketBase();
		const user = await pb.collection('users').getFirstListItem(`email = "${email}"`);

		if (!user) {
			throw redirect(303, '/auth');
		}

		await pb.collection('users').update(user.id, { twitchName: twitchName, twitchId: twitchId });

		throw redirect(303, '/');
	}
} satisfies Actions;
