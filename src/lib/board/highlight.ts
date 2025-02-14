import type { Position } from '$lib/board/types';
import type { EntityId } from '$lib/engine/types';
import type { GameState } from '../engine/store';
import { GRID_DIMENSIONS } from '$lib/board/constants';

export function getAvailableMoves(state: GameState, entityId: EntityId | null): Position[] {
	if (!entityId) return [];

	const entity = state.entities.find((e) => e.id === entityId);
	if (!entity) return [];

	const moves: Position[] = [];
	const range = entity.stats.movement;

	for (let dx = -range; dx <= range; dx++) {
		for (let dy = -range; dy <= range; dy++) {
			if (dx === 0 && dy === 0) continue;

			const newX = entity.position.x + dx;
			const newY = entity.position.y + dy;

			if (
				newX >= 0 &&
				newX < GRID_DIMENSIONS.width &&
				newY > 1 &&
				newY < GRID_DIMENSIONS.height &&
				Math.abs(dx) + Math.abs(dy) <= range
			) {
				moves.push({ x: newX, y: newY });
			}
		}
	}

	return moves;
}
