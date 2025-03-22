<script lang="ts">
	import Board from './components/Board.svelte';
	import InfoPanel from './components/InfoPanel.svelte';
	import TurnInfo from './components/TurnInfo.svelte';

	import { gameStore } from '$lib/engine/store';
	import { endTurn, resetAfterGoal } from '$lib/systems/turn';
	import Celebration from './components/Celebration.svelte';

	function handleCelebrationClose() {
		if ($gameStore.score.celebrating === 'goal') {
			gameStore.update(resetAfterGoal());
			gameStore.update(endTurn());
		} else {
			gameStore.update((state) => ({
				...state,
				score: {
					...state.score,
					celebrating: null
				}
			}));
		}
	}

	function getAutoCloseDuration(type: null | 'goal' | 'kill' | 'surprise'): number | undefined {
		switch (type) {
			case 'goal':
				return 15;
			case 'kill':
			case 'surprise':
			default:
				return 5;
		}
	}
</script>

<div class="col-span-1"></div>
<div class="col-span-1 flex flex-col text-center">
	<TurnInfo team="home" player="1" />
	<InfoPanel team="home" />
</div>
<div class="col-span-2 flex justify-center">
	<Board />
</div>
<div class="col-span-1 flex flex-col text-center">
	<TurnInfo team="away" player="2" />
	<InfoPanel team="away" />
</div>
{#if $gameStore.score.celebrating}
	<Celebration
		type={$gameStore.score.celebrating}
		homeScore={$gameStore.score.home}
		awayScore={$gameStore.score.away}
		scoringTeam={$gameStore.turn.activeTeam}
		onClose={handleCelebrationClose}
		autoCloseDuration={getAutoCloseDuration($gameStore.score.celebrating)}
	/>
{/if}
