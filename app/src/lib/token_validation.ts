import { ClientResponseError } from 'pocketbase';
import { getAdminPocketBase } from './pocketbase_utils';
import { getUserFromId } from './user_utils';


export async function isTokenValid(token: string, collection: string): Promise<boolean> {
    const pb = await getAdminPocketBase();

    try {
        await pb.collection(collection).getFirstListItem(`token = "${token}"`);
        return true
    } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
            return false;
        }
        throw error;
    }
}

export async function getUserFromToken(token: string, collection: string): Promise<User | undefined> {
    const pb = await getAdminPocketBase();

    try {
        const record = await pb.collection(collection).getFirstListItem(`token = "${token}"`);
        return getUserFromId(record.user);
    } catch (error) {
        if (error instanceof ClientResponseError && error.status === 404) {
            return undefined;
        }
        throw error;
    }
}