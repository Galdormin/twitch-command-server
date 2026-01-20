<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user, cards, user_cards, user_cards_by_streamer, streamers } = data);
	
	let selectedStreamer: string = 'all';
	let showOnlyOwned: boolean = false;
	
	$: filteredCards = selectedStreamer === 'all' 
		? user_cards 
		: user_cards_by_streamer?.get(selectedStreamer)?.cards || new Map();
	
	$: displayedCards = showOnlyOwned 
		? cards.filter(card => filteredCards?.has(card.id))
		: cards;
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
						class="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent"
					>
						Ma Collection
					</h1>
					<p class="text-gray-400 mt-2">
						{#if user?.username}
							Collection de <span class="text-pink-400"
								>{user.username}</span
							>
						{:else}
							Mes cartes personnelles
						{/if}
					</p>
				</div>
				<div class="flex gap-4">
					<a
						href="/"
						class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
					>
						🏠 Accueil
					</a>
					<a
						href="/ac/cards"
						class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-all"
					>
						🎴 Toutes les Cartes
					</a>
					{#if user?.username}
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

	<!-- Stats Bar -->
	{#if user_cards && cards}
		<div class="border-b border-gray-700 bg-gray-800/30">
			<div class="container mx-auto px-4 py-4">
				<div class="flex gap-8 justify-center">
					<div class="text-center">
						<div class="text-2xl font-bold text-pink-400">
							{selectedStreamer === 'all' ? user_cards.size : filteredCards.size}
						</div>
						<div class="text-xs text-gray-400">
							Cartes possédées
						</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-400">
							{cards.length}
						</div>
						<div class="text-xs text-gray-400">
							Total disponibles
						</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-400">
							{Math.round(
								((selectedStreamer === 'all' ? user_cards.size : filteredCards.size) / cards.length) * 100
							)}%
						</div>
						<div class="text-xs text-gray-400">Complétion</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Streamer Filter -->
	{#if streamers && streamers.length > 0}
		<div class="border-b border-gray-700 bg-gray-800/20">
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-center gap-8">
					<div class="flex items-center gap-4">
						<label for="streamer-filter" class="text-gray-300 font-medium">
							Filtrer par streamer:
						</label>
						<select
							id="streamer-filter"
							bind:value={selectedStreamer}
							class="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:border-pink-500 focus:border-pink-500 focus:outline-none transition-colors"
						>
							<option value="all">Tous les streamers</option>
							{#each streamers as streamer}
								<option value={streamer.id}>
									{streamer.username}
								</option>
							{/each}
						</select>
					</div>
					
					<div class="flex items-center gap-3">
						<label for="show-owned" class="text-gray-300 font-medium">
							Cartes possédées uniquement:
						</label>
						<button
							type="button"
							id="show-owned"
							on:click={() => showOnlyOwned = !showOnlyOwned}
							class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-800"
							class:bg-pink-500={showOnlyOwned}
							class:bg-gray-600={!showOnlyOwned}
						>
							<span
								class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
								class:translate-x-6={showOnlyOwned}
								class:translate-x-1={!showOnlyOwned}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Cards Grid -->
	<div class="container mx-auto px-4 py-8">
		{#if displayedCards && displayedCards.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each displayedCards as card}
					{@const isOwned = filteredCards?.has(card.id)}
					{@const quantity = filteredCards?.get(card.id) || 0}
					<div
						class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 transition-all duration-300 shadow-lg relative"
						class:hover:border-pink-500={isOwned}
						class:hover:scale-105={isOwned}
						class:opacity-60={!isOwned}
					>
						{#if isOwned}
							<div
								class="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full"
							>
								✓
							</div>
							{#if quantity > 1}
								<div
									class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
								>
									×{quantity}
								</div>
							{/if}
						{/if}
						<div
							class="aspect-[2/3] bg-gray-700 rounded-lg mb-3 overflow-hidden"
						>
							{#if card.image_url}
								<img
									src={card.image_url}
									alt={card.name}
									class="w-full h-full object-cover"
									class:grayscale={!isOwned}
									class:brightness-75={!isOwned}
								/>
							{:else}
								<div
									class="w-full h-full flex items-center justify-center text-4xl"
									class:grayscale={!isOwned}
								>
									🎴
								</div>
							{/if}
						</div>
						<h3
							class="font-semibold text-center text-sm mb-1"
							class:text-gray-500={!isOwned}
						>
							{card.name}
						</h3>
						<p
							class="text-gray-400 text-xs text-center"
							class:text-gray-600={!isOwned}
						>
							#{card.number}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">📦</div>
				<h2 class="text-2xl font-bold mb-2">Aucune carte disponible</h2>
			</div>
		{/if}
	</div>
</div>
