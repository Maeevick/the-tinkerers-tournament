<script lang="ts">
	import type { EntityId } from '$lib/entities';
	import type { Position } from '$lib/components/position';

	import { COLORS } from '$lib/constants/colors';
	import { COLUMNS, GOAL_CAGES, ROWS } from '$lib/constants/board';

	import { gameStore } from '$lib/engine/store';

	import { resetSelection, toggleEntitySelection } from '$lib/systems/selection';
	import { move, standUp } from '$lib/systems/movement';
	import { assault, attack, canAssault, canAttack } from '$lib/systems/combat';

	import Cell from './Cell.svelte';
	import Character from './Character.svelte';
	import Thingy from './Thingy.svelte';
	import { canPickup, pass, pickup, shot } from '$lib/systems/thingy';

	const FULL_ROWS = Array.from({ length: ROWS.length }, (_, i) => i);
	const FULL_COLS = Array.from({ length: COLUMNS.length }, (_, i) => i);

	let thingyKey = $derived(`${$gameStore.thingy.position.x}-${$gameStore.thingy.position.y}`);
	let selectedEntity = $derived($gameStore.entities.find((e) => e.state.selected) ?? null);
	let highlighted = $derived.by((): Set<string> => {
		return selectedEntity && selectedEntity.state.availableMoves
			? new Set(
					Array.from(selectedEntity.state.availableMoves.keys().filter((key) => key !== thingyKey))
				)
			: new Set<string>();
	});

	// FIXME: fix the x coordination double logic with the systems
	function handleEntityInteraction(entityId: EntityId) {
		const targetEntity = $gameStore.entities.find((e) => e.id === entityId);

		if (
			selectedEntity &&
			selectedEntity.state.isCarrier &&
			targetEntity &&
			selectedEntity.state.availableReceivers.has(entityId)
		) {
			return gameStore.update(pass(selectedEntity, targetEntity));
		}
		if (selectedEntity && targetEntity && canAttack(selectedEntity, targetEntity, $gameStore)) {
			return gameStore.update(attack(selectedEntity, targetEntity));
		}
		if (selectedEntity && targetEntity && canAssault(selectedEntity, targetEntity, $gameStore)) {
			return gameStore.update(assault(selectedEntity, targetEntity));
		}
		if (selectedEntity?.id === entityId && selectedEntity.state.isDown) {
			return gameStore.update(standUp(entityId));
		}
		return gameStore.update(toggleEntitySelection(entityId));
	}

	function handleCellInteraction({ x, y }: Position) {
		if (
			selectedEntity &&
			selectedEntity.state.isCarrier &&
			GOAL_CAGES[selectedEntity.team === 'home' ? 'away' : 'home'].some(
				(c) => c.x === x && c.y === y
			)
		) {
			return gameStore.update(shot(selectedEntity, { x: x - 1, y }));
		}
		if (
			!highlighted.has(`${x - 1}-${y}`) &&
			!(x - 1 === $gameStore.thingy.position.x && y === $gameStore.thingy.position.y)
		) {
			return gameStore.update(resetSelection());
		}
		if (
			selectedEntity &&
			x - 1 === $gameStore.thingy.position.x &&
			y === $gameStore.thingy.position.y
		) {
			return gameStore.update(pickup(selectedEntity.id));
		}
		return gameStore.update(move(selectedEntity?.id ?? null, { x: x - 1, y }));
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
				cursor={selectedEntity &&
				selectedEntity.team === $gameStore.turn.activeTeam &&
				!selectedEntity.state.isDown
					? 'pointer'
					: 'not-allowed'}
				color={selectedEntity && selectedEntity.team === $gameStore.turn.activeTeam
					? COLORS[selectedEntity.team].highlight
					: COLORS.field.highlight}
				onclick={() => handleCellInteraction({ x: col, y: row })}
			>
				{#if row > 0 && row < 25 && col > 0 && col < 11}
					{#if $gameStore.thingy.carrierId === null && $gameStore.thingy.position.x === col - 1 && $gameStore.thingy.position.y === row}
						<div
							style:cursor={selectedEntity && canPickup(selectedEntity, $gameStore)
								? 'grab'
								: 'auto'}
						>
							<Thingy />
						</div>
					{/if}
					{#if getEntityAt(col, row)}
						{@const character = getEntityAt(col, row)}
						{#if !character!.state.isDead}
							<Character
								index={-1}
								team={character!.team}
								role={character!.role}
								isSelected={character!.state.selected}
								isPotentialTarget={!!selectedEntity &&
									!!character &&
									(canAttack(selectedEntity, character, $gameStore) ||
										canAssault(selectedEntity, character, $gameStore))}
								isPotentialReceiver={!!selectedEntity &&
									!!character &&
									selectedEntity.state.availableReceivers.has(character.id)}
								isDown={character!.state.isDown}
								isCarrier={character!.state.isCarrier}
								onclick={() => handleEntityInteraction(character!.id)}
							/>
						{:else}
							<div class="h-full w-full rounded-full bg-red-500 opacity-30"></div>
						{/if}
					{/if}
				{/if}
			</Cell>
		{/each}
	{/each}
</div>
