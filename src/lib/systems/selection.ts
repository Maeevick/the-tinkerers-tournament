import type { GameState, GameStateUpdater } from '$lib/engine/store';
import type { EntityId } from '$lib/entities';

import { getAvailableMoves } from '$lib/systems/movement';

export function resetSelection(): GameStateUpdater {
	return (state: GameState) => {
		return {
			...state,
			entities: state.entities.map((entity) => ({
				...entity,
				state: {
					...entity.state,
					selected: false
				}
			}))
		};
	};
}

export function toggleEntitySelection(entityId: EntityId): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		return {
			...state,
			entities: state.entities.map((entity) => ({
				...entity,
				state: {
					...entity.state,
					selected: entity.id === entityId ? !entity.state.selected : false,
					availableMoves:
						entity.id === entityId && !entity.state.selected
							? getAvailableMoves(state, entityId)
							: entity.state.availableMoves
				}
			}))
		};
	};
}
