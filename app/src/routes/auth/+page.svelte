<script lang="ts">
	import { PUBLIC_CLIENT_PB } from '$env/static/public';
	import PocketBase from 'pocketbase';

	const pb = new PocketBase(PUBLIC_CLIENT_PB);

	let form: HTMLFormElement;

	async function login() {
		try {
			const authData = await pb
				.collection('users')
				.authWithOAuth2({ provider: 'twitch' });

			const token = document.createElement('input');
			token.type = 'hidden';
			token.name = 'token';
			token.value = authData.token;

			const email = document.createElement('input');
			email.type = 'hidden';
			email.name = 'email';
			email.value = authData.record.email;

			const twitchName = document.createElement('input');
			twitchName.type = 'hidden';
			twitchName.name = 'twitch_name';
			twitchName.value = authData.meta.name;

			const twitchId = document.createElement('input');
			twitchId.type = 'hidden';
			twitchId.name = 'twitch_id';
			twitchId.value = authData.meta.id;

			form.appendChild(token);
			form.appendChild(email);
			form.appendChild(twitchName);
			form.appendChild(twitchId);
			form.submit();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4"
>
	<div class="max-w-md w-full">
		<!-- Logo/Title -->
		<div class="text-center mb-8">
			<h1
				class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
			>
				AC Card Manager
			</h1>
			<p class="text-gray-400">Gérez vos cartes Animal Crossing</p>
		</div>

		<!-- Login Card -->
		<div
			class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700"
		>
			<div class="text-center mb-6">
				<div class="text-5xl mb-4">🎮</div>
				<h2 class="text-2xl font-bold text-white mb-2">Connexion</h2>
				<p class="text-gray-400 text-sm">
					Connectez-vous avec votre compte Twitch pour accéder à votre
					collection
				</p>
			</div>

			<form method="post" bind:this={form} class="hidden" />

			<button
				on:click={login}
				class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
			>
				<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
					/>
				</svg>
				Se connecter avec Twitch
			</button>

			<div class="mt-6 text-center">
				<a
					href="/"
					class="text-sm text-gray-400 hover:text-purple-400 transition-colors"
				>
					← Retour à l'accueil
				</a>
			</div>
		</div>

		<!-- Info Section -->
		<div class="mt-8 text-center">
			<p class="text-gray-500 text-sm">
				En vous connectant, vous acceptez nos conditions d'utilisation
			</p>
		</div>
	</div>
</div>
