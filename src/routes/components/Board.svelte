<script lang="ts">
	import { COLUMNS, ROWS } from '$lib/constants/board';

	import type { EntityId } from '$lib/entities';
	import type { Position } from '$lib/components/position';
	import { getAvailableMoves, moveEntity } from '$lib/systems/movement';
	import { getSelectedEntityId, toggleEntitySelection } from '$lib/systems/selection';
	import { gameStore } from '$lib/engine/store';

	import Cell from './Cell.svelte';
	import Character from './Character.svelte';

	const FULL_ROWS = Array.from({ length: ROWS.length }, (_, i) => i);
	const FULL_COLS = Array.from({ length: COLUMNS.length }, (_, i) => i);

	let highlighted = $state<Set<string>>(new Set());
	let currentTurn = $state<number>($gameStore.turn.currentTurn);
	$effect(() => {
		const nextTurn = $gameStore.turn.currentTurn;
		if (nextTurn > currentTurn) {
			highlighted = new Set();
			currentTurn = nextTurn;
		}
	});

	function handleEntityInteraction(entityId: EntityId | null) {
		if (!entityId) return;
		gameStore.update(toggleEntitySelection(entityId));

		highlighted = $gameStore.entities.find((e) => e.id === entityId)?.state.selected
			? new Set(getAvailableMoves($gameStore, entityId).map((pos) => `${pos.x}-${pos.y}`))
			: new Set();
	}

	function handleCellInteraction({ x, y }: Position) {
		if (!highlighted.has(`${x - 1}-${y}`)) return;

		const selectedEntityId = getSelectedEntityId($gameStore);

		gameStore.update(moveEntity(selectedEntityId, { x: x - 1, y }));

		highlighted = new Set(
			getAvailableMoves($gameStore, selectedEntityId).map((pos) => `${pos.x}-${pos.y}`)
		);
	}

	function getEntityAt(x: number, y: number) {
		return $gameStore.entities.find((e) => e.position.x === x - 1 && e.position.y === y);
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
