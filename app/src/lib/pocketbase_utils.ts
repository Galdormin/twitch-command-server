import PocketBase from 'pocketbase';
import { SERVER_PB, ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';

export async function getAdminPocketBase(): Promise<PocketBase> {
    const pb = new PocketBase(SERVER_PB);
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    return pb;
}

export async function getPublicPocketBase(): Promise<PocketBase> {
    return new PocketBase(SERVER_PB);
}