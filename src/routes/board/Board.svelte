<script lang="ts">
	import { COLUMNS, ROWS } from '$lib/board/constants';
	import { getAvailableMoves } from '$lib/board/highlight';
	import Cell from './Cell.svelte';
	import Character from '../character/Character.svelte';

	import { gameStore } from '$lib/engine/store';

	import type { EntityId } from '$lib/engine/types';

	const FULL_ROWS = Array.from({ length: ROWS.length }, (_, i) => i);
	const FULL_COLS = Array.from({ length: COLUMNS.length }, (_, i) => i);

	let selectedEntityId = $state<EntityId | null>(null);
	let highlighted = $state<Set<string>>(new Set());

	function handleEntityInteraction(entityId: EntityId | null) {
		if (selectedEntityId === entityId) {
			selectedEntityId = null;
			highlighted = new Set();
		} else {
			selectedEntityId = entityId;
			highlighted = new Set(
				getAvailableMoves($gameStore, entityId).map((pos) => `${pos.x}-${pos.y}`)
			);
		}
	}

	function getEntityAt(x: number, y: number) {
		return $gameStore.entities.find((e) => e.position.x === x - 1 && e.position.y === y);
	}
</script>

<div class="grid grid-cols-11 gap-0">
	{#each FULL_ROWS as row}
		{#each FULL_COLS as col}
			<Cell position={{ x: col, y: row }} {highlighted}>
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
