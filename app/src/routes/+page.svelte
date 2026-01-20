<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
</script>

<div
	class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
>
	<!-- Hero Section -->
	<div class="container mx-auto px-4 py-16">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Logo/Title -->
			<div class="mb-8">
				<h1
					class="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
				>
					AC Card Manager
				</h1>
				<p class="text-xl text-gray-300">
					Gérez vos cartes Animal Crossing obtenue chez vos
					streameur-euses préféré-es
				</p>
			</div>

			<!-- Main Content -->
			<div
				class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700 mb-12"
			>
				{#if user?.username}
					<div>
						<div class="mb-8">
							<p class="text-2xl mb-2">
								Bienvenue, <span
									class="text-purple-400 font-semibold"
									>{user.username}</span
								> !
							</p>
							<p class="text-gray-400">
								Accédez à vos cartes et explorez la collection
							</p>
						</div>

						<!-- Navigation Buttons -->
						<div
							class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8"
						>
							<a href="/ac/cards" class="block">
								<div
									class="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
								>
									<div class="text-4xl mb-3">🎴</div>
									<h3 class="text-xl font-bold mb-2">
										Toutes les Cartes
									</h3>
									<p class="text-purple-100 text-sm">
										Explorez la collection complète de
										cartes Animal Crossing
									</p>
								</div>
							</a>

							<a href="/ac/my_cards" class="block">
								<div
									class="bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
								>
									<div class="text-4xl mb-3">⭐</div>
									<h3 class="text-xl font-bold mb-2">
										Mes Cartes
									</h3>
									<p class="text-pink-100 text-sm">
										Gérez votre collection personnelle de
										cartes
									</p>
								</div>
							</a>
						</div>

						<!-- Logout Button -->
						<div class="mt-8">
							<a href="/auth/logout">
								<button
									class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white"
								>
									🚪 Se déconnecter
								</button>
							</a>
						</div>
					</div>
				{:else}
					<div class="py-8">
						<div class="text-5xl mb-6">🔒</div>
						<h2 class="text-3xl font-bold mb-4">
							Connexion requise
						</h2>
						<p class="text-gray-400 mb-8">
							Veuillez vous connecter pour accéder à vos cartes
						</p>
						<a href="/auth">
							<button
								class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
							>
								Se connecter avec Twitch
							</button>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Info Section -->
	<div class="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
		<div class="container mx-auto px-4 py-12">
			<div class="max-w-4xl mx-auto">
				<h2 class="text-3xl font-bold mb-8 text-center">
					À propos du projet
				</h2>

				<div class="grid md:grid-cols-3 gap-8 mb-8">
					<div class="text-center">
						<div class="text-4xl mb-3">🎮</div>
						<h3 class="text-xl font-semibold mb-2 text-purple-400">
							Collection
						</h3>
						<p class="text-gray-400 text-sm">
							Visualisez facilement les cartes de votre collection
							Animal Crossing
						</p>
					</div>

					<div class="text-center">
						<div class="text-4xl mb-3">💜</div>
						<h3 class="text-xl font-semibold mb-2 text-purple-400">
							Twitch
						</h3>
						<p class="text-gray-400 text-sm">
							Connectez-vous avec votre compte Twitch pour voir
							les cartes que vous avez obtenue en stream
						</p>
					</div>

					<div class="text-center">
						<div class="text-4xl mb-3">🔄</div>
						<h3 class="text-xl font-semibold mb-2 text-pink-400">
							Synchronisation
						</h3>
						<p class="text-gray-400 text-sm">
							Vos cartes sont synchronisées et accessibles partout
						</p>
					</div>
				</div>

				<div class="text-center text-gray-500 text-sm">
					<p>© 2025 Galdormin & Paraguus - Propulsé par SvelteKit</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import "tailwindcss" reference;

	button {
		@apply font-bold;
	}
</style>
