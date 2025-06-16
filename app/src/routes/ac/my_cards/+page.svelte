<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    $: ({ user, cards, user_cards } = data);
</script>


<main class="p-8">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-semibold">Mes Cartes</h1>
    </div>
    <div class="w-3/4 m-auto flex flex-wrap justify-center">
        {#each cards as card}
            <div class="p-4 overflow-hidden relative">
                {#if user_cards.has(card.id)}
                <img src="{card.image_url}" alt="Card Image" class="h-48 w-48 object-scale-down" />
                {#if user_cards.get(card.id) > 1}
                <div class="absolute bottom-1 right-7 bg-red-400 text-white text-s font-bold rounded-full h-8 w-8 flex items-center justify-center">
                    {user_cards.get(card.id)}
                </div>
                {/if}
                {:else}
                <img src="{card.image_url}" alt="Card Image" class="h-48 w-48 object-scale-down grayscale" />
                {/if}
            </div>
        {/each}
    </div>
</main>