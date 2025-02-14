<script lang="ts">
	import { COLUMNS } from '$lib/board/constants';
	import { getAvailableMoves } from '$lib/board/highlight';
	import Cell from './Cell.svelte';
	import Character from '../character/Character.svelte';

	import { gameStore } from '$lib/engine/store';

	import type { EntityId } from '$lib/engine/types';

	let selectedEntityId = $state<EntityId | null>(null);

	const availableMoves = $derived(getAvailableMoves($gameStore, selectedEntityId));

	function handleEntityInteraction(entityId: EntityId | null) {
		selectedEntityId = selectedEntityId === entityId ? null : entityId;
	}

	const fullRows = Array.from({ length: 26 }, (_, i) => i);
	const fullCols = Array.from({ length: 11 }, (_, i) => i);

	function getCellContent(row: number, col: number): string {
		if (col === 0 || col === 10) {
			if (row === 0 || row === 25) return '';
			return row.toString();
		}
		if (row === 0 || row === 25) {
			if (col === 0 || col === 10) return '';
			return COLUMNS[col - 1];
		}
		return '';
	}

	function getEntityAt(x: number, y: number) {
		return $gameStore.entities.find((e) => e.position.x === x - 1 && e.position.y === y);
	}

	function isHighlighted(x: number, y: number) {
		return availableMoves.some((move) => move.x === x - 1 && move.y === y);
	}
</script>

<div class="grid grid-cols-11 gap-0">
	{#each fullRows as row}
		{#each fullCols as col}
			<Cell
				position={{ x: col, y: row }}
				isHighlighted={isHighlighted(col, row)}
				label={getCellContent(row, col)}
			>
				{#if row > 0 && row < 25 && col > 0 && col < 11}
					{#if getEntityAt(col, row)}
						{@const character = getEntityAt(col, row)}
						<Character
							index={-1}
							team={character!.team}
							role={character!.role}
							isSelected={selectedEntityId === character!.id}
							onclick={() => handleEntityInteraction(character!.id)}
						/>
					{/if}
				{/if}
			</Cell>
		{/each}
	{/each}
</div>
