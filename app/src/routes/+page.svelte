<script lang="ts">
</script>


<main class="bg-main min-h-screen p-8 flex flex-col items-center justify-center">
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        <button class="flex-1 bg-card rounded-lg shadow-lg p-6 justify-center flex flex-col items-center" onclick={() => (window.location.href = '/ac/cards')}>
            <h2 class="text-2xl font-semibold mb-4 text-white">Toutes les cartes Animal Crossing</h2>
            <!-- Liste des cartes ici -->
            <img class="self-center" src="https://picsum.photos/400/300" />
            <div class="text-gray-300">Affiche toutes les cartes que vous pouvez obtenir.</div>
        </button>
        <button class="flex-1 bg-card rounded-lg shadow-lg p-6 justify-center flex flex-col items-center" onclick={() => (window.location.href = '/ac/my_cards')}>
            <h2 class="text-2xl font-semibold mb-4 text-white">Mes cartes Animal Crossing</h2>
            <!-- Liste des cartes obtenues ici -->
            <img class="self-center" src="https://picsum.photos/400/300" />
            <div class="text-gray-300">Affiche l'ensemble des cartes que vous avez obtenues.</div>
        </button>
    </div>
    <slot />
</main>


<style>
    button {
        @apply text-white px-4 py-2 rounded;
    }
</style>