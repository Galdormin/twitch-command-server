<script lang="ts">
	import '../app.css';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user, route } = data);
</script>

<main class="bg-main min-h-screen">
	<slot />
</main>

<style>
	button {
		@apply text-white px-4 py-2 rounded;
	}
</style>
