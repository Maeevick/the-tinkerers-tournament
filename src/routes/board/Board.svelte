<script lang="ts">
	import type { EntityId } from '$lib/entities';
	import type { Position } from '$lib/components/position';

	import { COLUMNS, ROWS } from '$lib/constants/board';

	import { getAvailableMoves, moveEntity } from '$lib/systems/movement';
	import { gameStore } from '$lib/engine/store';

	import Cell from './Cell.svelte';
	import Character from '../character/Character.svelte';
	import { getSelectedEntityId, toggleEntitySelection } from '$lib/systems/selection';

	const FULL_ROWS = Array.from({ length: ROWS.length }, (_, i) => i);
	const FULL_COLS = Array.from({ length: COLUMNS.length }, (_, i) => i);

	let highlighted = $state<Set<string>>(new Set());

	function getEntityAt(x: number, y: number) {
		return $gameStore.entities.find((e) => e.position.x === x - 1 && e.position.y === y);
	}

	function handleEntityInteraction(entityId: EntityId | null) {
		if (!entityId) return;
		const state = toggleEntitySelection($gameStore, entityId);
		gameStore.set(state);

		highlighted = state.entities.find((e) => e.id === entityId)?.state.selected
			? new Set(getAvailableMoves(state, entityId).map((pos) => `${pos.x}-${pos.y}`))
			: new Set();
	}

	function handleCellInteraction({ x, y }: Position) {
		if (!highlighted.has(`${x - 1}-${y}`)) return;

		const selectedEntityId = getSelectedEntityId($gameStore);

		gameStore.set(moveEntity($gameStore, selectedEntityId, { x: x - 1, y }));

		highlighted = new Set(
			getAvailableMoves($gameStore, selectedEntityId).map((pos) => `${pos.x}-${pos.y}`)
		);
	}
</script>

<div class="grid grid-cols-11 gap-0">
	{#each FULL_ROWS as row}
		{#each FULL_COLS as col}
			<Cell
				index={-1}
				position={{ x: col, y: row }}
				{highlighted}
				onclick={() => handleCellInteraction({ x: col, y: row })}
			>
				{#if row > 0 && row < 25 && col > 0 && col < 11}
					{#if getEntityAt(col, row)}
						{@const character = getEntityAt(col, row)}
						<Character
							index={-1}
							team={character!.team}
							role={character!.role}
							isSelected={character!.state.selected}
							onclick={() => handleEntityInteraction(character!.id)}
						/>
					{/if}
				{/if}
			</Cell>
		{/each}
	{/each}
</div>
