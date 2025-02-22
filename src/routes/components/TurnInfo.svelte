<script lang="ts">
	import type { Team } from '$lib/components/team';
	import { COLORS } from '$lib/constants/colors';
	import { gameStore } from '$lib/engine/store';
	import { endTurn } from '$lib/systems/turn';

	let { team }: { team: Team } = $props<{ team: Team }>();

	let isActive = $derived($gameStore.turn.activeTeam === team);
	let isOver = $derived($gameStore.turn.currentTurn >= $gameStore.turn.totalTurns);
	let playerNumber = $derived(team === 'home' ? '1' : '2');

	function handleEndTurn() {
		return gameStore.update(endTurn());
	}
</script>

<div class="flex flex-1 flex-col justify-items-start space-y-4 p-4">
	<div class="text-xl font-bold" style:color={isActive ? '#000' : '#999'}>
		Player {playerNumber}
		{#if isActive && !isOver}is playing{/if}
		{#if isOver}<div>{team === 'home' ? 'wins' : 'loses'}</div>{/if}
	</div>
	{#if !isOver}
		<div>
			Turn {Math.floor($gameStore.turn.currentTurn)} / {$gameStore.turn.totalTurns}
		</div>
		{#if isActive}
			<button
				class="rounded {`bg-[${COLORS[team].light}]`} px-4 py-2 text-white"
				onclick={() => handleEndTurn()}
			>
				End Turn
			</button>
		{/if}
	{/if}
</div>
