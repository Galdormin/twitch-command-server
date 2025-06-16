<script lang="ts">
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    let showAddForm = false;
    let cardId: number;
    let name: string;
    let family: string;
    let wiki: string;
    let imageFile: File;
    let credit: string;

    $: ({ cards, families } = data);

    function openAddForm() {
        showAddForm = true;
    }

    function closeAddForm() {
        showAddForm = false;
    }

    function loadImage(event: Event) {
        imageFile = event.target.files[0];

        // Load other field if exists
        const imageName = imageFile.name;
        const regex = /(\d+)? - (\w+)?/g
        const result = regex.exec(imageName);

        if (result) {
            cardId = Number(result[1]) ?? 0;
            name = result[2] ?? "";
        }
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('id', cardId.toString());
        formData.append('name', name);
        formData.append('family', family);
        formData.append('wiki', wiki ?? '');
        formData.append('image', imageFile);
        formData.append('credit', credit ?? '');

        const response = await fetch('/ac/add_card', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            closeAddForm();
            invalidateAll();
        } else {
            console.error('Failed to add card');
        }
    }
</script>

<main class="p-8">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-semibold">Liste des cartes</h1>
    </div>
    <div class="w-3/4 m-auto flex flex-wrap justify-center">
        {#each cards as card}
            <div class="p-4 border rounded overflow-hidden">
                <img src="{card.image_url}" alt="Card Image" class="h-48 w-48 object-scale-down" />
                <div class="mt-2">
                    <p><strong>Nom:</strong> {card.name}</p>
                    <p><strong>Famille:</strong> {card.family}</p>
                    {#if card.wiki}
                        <p><strong>Wiki:</strong> <a href="{card.wiki}" target="_blank" class="text-blue-500">Lien</a></p>
                    {/if}
                    {#if card.credit}
                        <p><strong>Crédit:</strong> {card.credit}</p>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    {#if showAddForm}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
        <div class="bg-white p-8 rounded shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-semibold mb-4">Ajouter une nouvelle carte</h2>
            <form on:submit={handleSubmit} class="flex flex-col gap-4">
                <label class="flex flex-col gap-2">
                    <span>ID *</span>
                    <input type="number" min="1" bind:value={cardId} class="border rounded p-2" required />
                </label>
                <label class="flex flex-col gap-2">
                    <span>Nom *</span>
                    <input type="text" bind:value={name} class="border rounded p-2" required />
                </label>
                <label class="flex flex-col gap-2">
                    <span>Famille *</span>
                    <select bind:value={family} class="border rounded p-2" required>
                        <option value="" disabled selected>Choisir une famille</option>
                        {#each families as family}
                            <option value={family.id}>{family.name}</option>
                        {/each}
                    </select>
                </label>
                <label class="flex flex-col gap-2">
                    <span>Image *</span>
                    <input type="file" accept=".jpg,.png" on:change={loadImage} class="border rounded p-2" required />
                </label>
                <label class="flex flex-col gap-2">
                    <span>Lien vers le Wiki</span>
                    <input type="url" bind:value={wiki} class="border rounded p-2" />
                </label>
                <label class="flex flex-col gap-2">
                    <span>Crédit de l'artiste</span>
                    <input type="text" bind:value={credit} class="border rounded p-2" />
                </label>
                <div class="flex justify-end gap-4">
                    <button type="button" on:click={closeAddForm} class="border rounded p-2 bg-gray-300 hover:bg-gray-400">Annuler</button>
                    <button type="submit" class="border rounded p-2 bg-gray-800 text-white hover:bg-gray-700">Créer</button>
                </div>
            </form>
        </div>
    </div>
    {/if}

    {#if data.user?.is_admin}
    <button
        type="button"
        on:click={openAddForm}
        class="fixed bottom-8 right-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
        </svg>          
        <span class="sr-only">Icon description</span>
    </button>
    {/if}
</main>