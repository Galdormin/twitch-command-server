<script lang="ts">
	import '../app.css';
	import type { PageData } from './$types';

	export let data: PageData;
    $: ({ user, route } = data);
</script>

{#if !route.id.includes("/auth")}
<nav class="flex justify-between items-center p-4 bg-nav text-white">
    <div class="text-lg font-bold">
        Twitch Command App
    </div>
    <button on:click={() => (window.location.href = '/auth')} class="flex items-center twitch-color">
        {#if user?.username}
            Déconnexion
        {:else}
            Se connecter
        {/if}
    </button>
</nav>
{/if}


<main class="bg-main min-h-screen p-8">
    <slot />
</main>

<style>
    button {
        @apply text-white px-4 py-2 rounded;
    }
</style>