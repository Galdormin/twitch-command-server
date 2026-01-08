// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import PocketBase from 'pocketbase';
declare global {
	// Custom Types
	interface User {
		id: string;
		email: string;
		username: string;
		is_admin: boolean;
		twitch_id: number;
	};

	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: User;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};