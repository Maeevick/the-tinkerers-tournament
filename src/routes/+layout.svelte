<script lang="ts">
	import type { Snippet } from 'svelte';

	import '../app.css';

	let { children } = $props<{ children: Snippet }>();
</script>

<div class="flex-col bg-gray-100 p-4">
	<header class="flex-col items-start">
		<h1 class="text-center text-2xl">Welcome to The Tinkekerer's Tournament (TTT)</h1>
		<p class="text-center italic">
			Backstage at <a href="https://maeevick.substack.com" target="_blank" class="underline">
				Maeevick's Bazaar
			</a> to read the adventure
		</p>
	</header>

	<main class="grid grid-cols-6 items-center p-4">
		{@render children()}
	</main>

	<footer class="flex-col items-start p-4">
		<p class="text-center">
			Made with ❤️ and 😜 by <a
				href="https://github.com/Maeevick"
				target="_blank"
				class="underline"
			>
				Aurel / Maeevick
			</a>
		</p>
	</footer>
</div>
