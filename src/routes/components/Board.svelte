<script lang="ts">
	import { untrack } from 'svelte';

	import { COLORS } from '$lib/constants/colors';
	import { COLUMNS, ROWS } from '$lib/constants/board';

	import type { EntityId } from '$lib/entities';
	import type { Position } from '$lib/components/position';

	import { moveEntity } from '$lib/systems/movement';
	import {
		getSelectedEntityId,
		resetSelection,
		toggleEntitySelection
	} from '$lib/systems/selection';
	import { gameStore } from '$lib/engine/store';

	import Cell from './Cell.svelte';
	import Character from './Character.svelte';

	const FULL_ROWS = Array.from({ length: ROWS.length }, (_, i) => i);
	const FULL_COLS = Array.from({ length: COLUMNS.length }, (_, i) => i);

	let selectedEntity = $derived($gameStore.entities.find((e) => e.state.selected) ?? null);
	let highlighted = $derived.by((): Set<string> => {
		return selectedEntity && selectedEntity.state.availableMoves
			? new Set(Array.from(selectedEntity.state.availableMoves.keys()))
			: new Set<string>();
	});

	function handleEntityInteraction(entityId: EntityId | null) {
		if (!entityId) return;
		return gameStore.update(toggleEntitySelection(entityId));
	}

	function handleCellInteraction({ x, y }: Position) {
		if (!highlighted.has(`${x - 1}-${y}`)) {
			return gameStore.update(resetSelection());
		}

		return gameStore.update(moveEntity(getSelectedEntityId($gameStore), { x: x - 1, y }));
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
				cursor={selectedEntity && selectedEntity.team === $gameStore.turn.activeTeam
					? 'pointer'
					: 'not-allowed'}
				color={selectedEntity && selectedEntity.team === $gameStore.turn.activeTeam
					? COLORS[selectedEntity.team].highlight
					: COLORS.field.highlight}
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
