<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Team } from '$lib/components/team';

	let { type, onClose, autoCloseDuration, homeScore, awayScore, scoringTeam } = $props<{
		type: null | 'goal' | 'kill' | 'surprise';
		onClose: () => void;
		autoCloseDuration?: number;
		homeScore: number;
		awayScore: number;
		scoringTeam: Team;
	}>();

	let remainingSeconds = $state(autoCloseDuration || 0);
	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (autoCloseDuration && autoCloseDuration > 0) {
			remainingSeconds = autoCloseDuration;

			timer = setInterval(() => {
				remainingSeconds--;

				if (remainingSeconds <= 0) {
					if (timer) clearInterval(timer);
					onClose();
				}
			}, 1000);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	});

	function getTitle(type: 'goal' | 'kill' | 'surprise'): string {
		switch (type) {
			case 'goal':
				return "IT'S A GOOOAL!";
			case 'kill':
				return 'KILLING SPREE!';
			case 'surprise':
			default:
				return 'SURPRISE!';
		}
	}

	function getButtonText(type: 'goal' | 'kill' | 'surprise'): string {
		switch (type) {
			case 'goal':
				return 'Start a new run!';
			case 'kill':
				return 'Continue the massacre!';
			case 'surprise':
			default:
				return 'Continue the show!';
		}
	}

	function getMessage(type: 'goal' | 'kill' | 'surprise'): string {
		switch (type) {
			case 'goal':
				return `Team ${scoringTeam} scores!\nScore: ${homeScore} - ${awayScore}`;
			case 'kill':
				return `Team ${scoringTeam} eliminates an opponent!`;
			case 'surprise':
			default:
				return `Team ${scoringTeam} creates a miracle (or almost)!`;
		}
	}
</script>

<div transition:fade class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
	<div class="max-w-md rounded-lg bg-white p-6 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">{getTitle(type)}</h2>
		<p class="mb-6 text-lg whitespace-pre-line">{getMessage(type)}</p>
		<button
			class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			onclick={onClose}
		>
			{getButtonText(type)}
		</button>
		{#if remainingSeconds > 0}
			<div class="mt-2 text-center text-sm text-gray-500">
				Auto-continuing in {remainingSeconds} seconds...
			</div>
		{/if}
	</div>
</div>
