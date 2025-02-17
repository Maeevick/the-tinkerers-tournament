import type { Position } from '$lib/board/types';
import type { EntityId } from '$lib/engine/types';
import type { GameState } from '../engine/store';
import { GRID_DIMENSIONS } from '$lib/board/constants';

function getNeighborsPositions(position: Position): Position[] {
	const { x, y } = position;
	return [
		{ x: x + 1, y },
		{ x: x - 1, y },
		{ x, y: y + 1 },
		{ x, y: y - 1 }
	].filter(
		(pos) =>
			pos.x >= 0 && pos.x < GRID_DIMENSIONS.width && pos.y > 1 && pos.y < GRID_DIMENSIONS.height
	);
}

function getMoveCost(from: Position, to: Position): number {
	return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

function exploreMoves(
	start: Position,
	current: Position,
	blocked: Set<string>,
	visited: Set<string>,
	movement: number
): Position[] {
	for (const neighborPosition of getNeighborsPositions(current)) {
		const remaining = movement - getMoveCost(current, neighborPosition);
		if (remaining >= 0 && !blocked.has(`${neighborPosition.x}-${neighborPosition.y}`)) {
			visited.add(`${neighborPosition.x}-${neighborPosition.y}`);
			exploreMoves(start, neighborPosition, blocked, visited, remaining);
		}
	}
	return Array.from(visited.values()).map((key) => {
		const [x, y] = key.split('-').map(Number);
		return { x, y };
	});
}

export function getAvailableMoves(state: GameState, entityId: EntityId | null): Position[] {
	if (!entityId) return [];

	const entity = state.entities.find((e) => e.id === entityId);
	if (!entity) return [];

	return exploreMoves(
		entity.position,
		entity.position,
		new Set(
			state.entities
				.filter(
					(e) =>
						e.id !== entityId &&
						Math.abs(e.position.x - entity.position.x) <= entity.stats.movement &&
						Math.abs(e.position.y - entity.position.y) <= entity.stats.movement
				)
				.map((e) => `${e.position.x}-${e.position.y}`)
		),
		new Set([`${entity.position.x}-${entity.position.y}`]),
		entity.stats.movement
	);
}
