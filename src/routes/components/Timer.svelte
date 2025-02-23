<script lang="ts">
	import { COLORS } from '$lib/constants/colors';

	import type { Team } from '$lib/components/team';

	import { WARNING_THRESHOLD } from '$lib/components/turn';
	import { endTurn, updateTimer } from '$lib/systems/turn';
	import { gameStore } from '$lib/engine/store';

	let { team }: { team: Team } = $props<{ team: Team }>();
	let isWarning = $derived($gameStore.turn.timeLeft <= WARNING_THRESHOLD);

	$effect(() => {
		const interval = setInterval(() => {
			if ($gameStore.turn.timeLeft > 0) {
				gameStore.update(updateTimer());
			} else {
				gameStore.update(endTurn());
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div>
	<div class="text-2xl font-bold" style:color={isWarning ? COLORS[team].light : 'black'}>
		{$gameStore.turn.timeLeft}s
		{#if isWarning}
			<span>Hurry!</span>
		{/if}
	</div>
</div>
