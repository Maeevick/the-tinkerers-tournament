<script lang="ts">
	import type { Team } from '$lib/components/team';
	import { COLORS } from '$lib/constants/colors';
	import { gameStore } from '$lib/engine/store';
	import { endTurn } from '$lib/systems/turn';

	import Timer from './Timer.svelte';

	let { team, player }: { team: Team; player: '1' | '2' } = $props<{
		team: Team;
		player: '1' | '2';
	}>();

	let isOver = $derived($gameStore.turn.currentTurn >= $gameStore.turn.totalTurns);
	let isActive = $derived(!isOver && $gameStore.turn.activeTeam === team);

	function handleEndTurn() {
		return gameStore.update(endTurn());
	}
</script>

<div class="h-50">
	<div class="flex flex-1 flex-col justify-items-start space-y-4 p-4">
		<div class="text-xl font-bold" style:color={isOver || isActive ? COLORS[team].light : '#999'}>
			Player {player}
			{#if isActive}is playing{/if}
			<!-- TODO: Dummy Code until scoring is implemented -->
			{#if isOver}<div>Game Over!</div>{/if}
			<!-- -->
		</div>
		{#if !isOver}
			<div>
				Score: {$gameStore.score[team]} & Turn {Math.floor($gameStore.turn.currentTurn)} / {$gameStore
					.turn.totalTurns}
			</div>
			{#if isActive}
				<div class="flex flex-col gap-2">
					<Timer {team} />
					<button
						class="rounded {`bg-[${COLORS[team].light}]`} px-4 py-2 text-white"
						onclick={() => handleEndTurn()}
					>
						End Turn
					</button>
				</div>
			{/if}
		{:else}
			<div>
				Score: {$gameStore.score[team]}
			</div>
		{/if}
	</div>
</div>
