import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
    // Vider l'authentification PocketBase
    locals.pb?.authStore.clear();

    // Supprimer l'utilisateur local
    locals.user = undefined;

    // Supprimer le cookie d'authentification
    cookies.delete('pb_auth', { path: '/' });

    throw redirect(303, '/');
};
