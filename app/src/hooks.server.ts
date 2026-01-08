import { redirect, type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { building } from '$app/environment';
import { SERVER_PB } from '$env/static/private';
import { getTwitchId, isAdmin } from '$lib/user_utils';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = undefined
	event.locals.pb = new PocketBase(SERVER_PB);

	const isAuth: boolean = event.url.pathname === '/auth';
	const isLogout: boolean = event.url.pathname === '/auth/logout';

	if (isAuth || building) {
		event.cookies.set('pb_auth', '', { path: '/' });
		return await resolve(event);
	}

	const pb_auth = event.request.headers.get('cookie') ?? '';
	event.locals.user = await loadUserFromCookie(event.locals.pb, pb_auth);

	if (!event.locals.user && !isLogout) {
		try {
			event.locals.user = await refreshAuth(event.locals.pb);
		} catch (_) {
			console.log('Session expired');
			// throw redirect(303, '/auth');
		}
	}

	const response = await resolve(event);

	// Ne pas exporter le cookie si on se déconnecte
	if (!isLogout) {
		const cookie = event.locals.pb.authStore.exportToCookie({ sameSite: 'lax' });
		response.headers.append('set-cookie', cookie);
	}

	return response;
};


async function refreshAuth(pb: PocketBase): Promise<User> {
	const auth = await pb.collection('users').authRefresh<{ id: string; email: string }>();
	const user: User = {
		id: auth.record.id,
		email: auth.record.email,
		username: auth.record.twitchName ?? auth.record.username,
		twitch_id: auth.record.twitchId ?? 0,
		is_admin: await isAdmin(auth.record.id) ?? false,
	};

	return user;
}

async function loadUserFromCookie(pb: PocketBase, cookie: string): Promise<User | undefined> {
	pb.authStore.loadFromCookie(cookie);
	if (!pb.authStore.isValid || !pb.authStore.model) {
		return undefined;
	}

	const model = pb.authStore.model;
	return {
		id: model.id,
		email: model.email,
		username: model.twitchName ?? model.username,
		twitch_id: model.twitchId ?? 0,
		is_admin: await isAdmin(model.id) ?? false,
	};
}