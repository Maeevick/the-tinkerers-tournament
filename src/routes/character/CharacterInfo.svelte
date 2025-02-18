<script lang="ts">
	import { gameStore } from '$lib/engine/store';

	const getSelectedCharacter = () => {
		return $gameStore.entities.find((e) => e.state.selected);
	};
</script>

{#if getSelectedCharacter()}
	{@const character = getSelectedCharacter()}
	<div
		class="w-64 rounded-lg border-4 p-4"
		style:border-color={character!.team === 'home' ? '#00a1de' : '#e22fbd'}
	>
		<div class="space-y-4">
			<div class="text-xl font-bold capitalize">
				{character!.team} Team
			</div>

			<div>
				<span class="font-semibold">Role:</span>
				{character!.role}
			</div>

			<div>
				<span class="font-semibold">Stats:</span>
				<div class="ml-2">
					<div>Movement: {character!.stats.movement}</div>
					<div>Remaining: {character!.state.remainingMovement}</div>
				</div>
			</div>

			<div>
				<span class="font-semibold">Position:</span>
				<div class="ml-2">
					x: {character!.position.x}, y: {character!.position.y}
				</div>
			</div>
		</div>
	</div>
{/if}
