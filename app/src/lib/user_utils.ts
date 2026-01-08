import { ClientResponseError } from 'pocketbase';
import { getAdminPocketBase } from './pocketbase_utils';


export async function isAdmin(userId: string): Promise<boolean> {
    const pb = await getAdminPocketBase();

    const user = await pb.collection('users').getOne(userId);

    try {
        const adminList = await pb.collection('ac_admins').getFirstListItem(`user = "${user.id}"`);
    } catch (err) {
        if (err instanceof ClientResponseError) {
            return false
        }
        throw err;
    }

    return true;
}

export async function getUserFromId(userId: string): Promise<User> {
    const pb = await getAdminPocketBase();

    const user = await pb.collection('users').getOne(userId);
    return {
        id: user.id,
        email: user.email,
        username: user.twitchName ?? user.username,
        twitch_id: user.twitchId ?? 0,
        is_admin: await isAdmin(user.id) ?? false,
    };
}

export async function getUserFromTwitchId(twitchId: number): Promise<User> {
    const pb = await getAdminPocketBase();

    const user = await pb.collection('users').getFirstListItem(`twitchId = "${twitchId}"`);
    return {
        id: user.id,
        email: user.email,
        username: user.twitchName ?? user.username,
        twitch_id: user.twitchId ?? 0,
        is_admin: await isAdmin(user.id) ?? false,
    };
}
