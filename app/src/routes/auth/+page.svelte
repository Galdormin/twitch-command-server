<script lang="ts">
	import { PUBLIC_CLIENT_PB } from '$env/static/public';
	import PocketBase from 'pocketbase';

	const pb = new PocketBase(PUBLIC_CLIENT_PB);

	let form: HTMLFormElement;

	async function login() {
		try {
			const authData = await pb.collection('users').authWithOAuth2({ provider: 'twitch' });

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

<main class="min-h-screen flex items-center justify-center bg-main">
  <div class="bg-card rounded shadow p-6 max-w-md w-full text-center">
    <h1 class="text-2xl mb-4">Connexion</h1>
    <p class="mb-4">Connectez-vous via Twitch pour accéder à vos informations.</p>
    <form method="post" bind:this={form}/>

	<button	on:click={login} class="rounded p-2 pl-5 pr-5 mt-10 twitch-color">
		Se connecter avec Twitch
	</button>
  </div>
</main>

<style>
	main {
	  @apply rounded px-4 py-2;
	  color: var(--color-text);
	}
</style>