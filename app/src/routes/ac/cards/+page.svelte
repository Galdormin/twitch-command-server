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

	$: ({ user, cards, families } = data);

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
		const regex = /(\d+)? - (\w+)?/g;
		const result = regex.exec(imageName);

		if (result) {
			cardId = Number(result[1]) ?? 0;
			name = result[2] ?? '';
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

<div
	class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
>
	<!-- Header -->
	<div class="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<div>
					<h1
						class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
					>
						Toutes les Cartes
					</h1>
					<p class="text-gray-400 mt-2">
						Collection complète Animal Crossing
					</p>
				</div>
				<div class="flex gap-4">
					<a
						href="/"
						class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
					>
						🏠 Accueil
					</a>
					{#if user?.username}
						<a
							href="/ac/my_cards"
							class="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 rounded-lg transition-all"
						>
							⭐ Mes Cartes
						</a>
						<a
							href="/auth/logout"
							class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
						>
							🚪 Déconnexion
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Cards Grid -->
	<div class="container mx-auto px-4 py-8">
		{#if cards && cards.length > 0}
			<div class="mb-6">
				<p class="text-gray-400">
					<span class="text-purple-400 font-semibold"
						>{cards.length}</span
					> cartes disponibles
				</p>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each cards as card}
					<div
						class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
					>
						<div
							class="aspect-[2/3] bg-gray-700 rounded-lg mb-3 overflow-hidden"
						>
							{#if card.image_url}
								<img
									src={card.image_url}
									alt={card.name}
									class="w-full h-full object-cover"
								/>
							{:else}
								<div
									class="w-full h-full flex items-center justify-center text-4xl"
								>
									🎴
								</div>
							{/if}
						</div>
						<h3 class="font-semibold text-center text-sm mb-1">
							{card.name}
						</h3>
						<p class="text-gray-400 text-xs text-center">
							#{card.id}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">📭</div>
				<p class="text-xl text-gray-400">Aucune carte disponible</p>
			</div>
		{/if}
	</div>

	{#if showAddForm}
		<div
			class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
			on:click={closeAddForm}
		>
			<div
				class="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-lg w-full"
				on:click|stopPropagation
			>
				<div class="flex justify-between items-center mb-6">
					<h2
						class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
					>
						Ajouter une carte
					</h2>
					<button
						type="button"
						on:click={closeAddForm}
						class="text-gray-400 hover:text-white transition-colors"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<form on:submit={handleSubmit} class="flex flex-col gap-5">
					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>ID de la carte *</span
						>
						<input
							type="number"
							min="1"
							bind:value={cardId}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
							placeholder="001"
							required
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>Nom du personnage *</span
						>
						<input
							type="text"
							bind:value={name}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
							placeholder="Isabelle"
							required
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>Famille *</span
						>
						<select
							bind:value={family}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
							required
						>
							<option
								value=""
								disabled
								selected
								class="text-gray-400"
								>Choisir une famille</option
							>
							{#each families as family}
								<option value={family.id}>{family.name}</option>
							{/each}
						</select>
					</label>

					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>Image *</span
						>
						<input
							type="file"
							accept=".jpg,.jpeg,.png"
							on:change={loadImage}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-500 transition-all"
							required
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>Lien vers le Wiki</span
						>
						<input
							type="url"
							bind:value={wiki}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
							placeholder="https://..."
						/>
					</label>

					<label class="flex flex-col gap-2">
						<span class="text-sm font-semibold text-gray-300"
							>Crédit de l'artiste</span
						>
						<input
							type="text"
							bind:value={credit}
							class="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
							placeholder="Nom de l'artiste"
						/>
					</label>

					<div class="flex gap-4 mt-4">
						<button
							type="button"
							on:click={closeAddForm}
							class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all font-semibold shadow-lg"
						>
							✨ Créer la carte
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	{#if data.user?.is_admin}
		<button
			type="button"
			on:click={openAddForm}
			class="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full p-4 shadow-2xl transition-all transform hover:scale-110 z-40"
			title="Ajouter une carte"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/>
			</svg>
		</button>
	{/if}
</div>
