import type { GameState, GameStateUpdater } from '$lib/engine/store';
import type { EntityId } from '$lib/entities';

export function getSelectedEntityId(state: GameState): EntityId | null {
	return state.entities.find((e) => e.state.selected)?.id ?? null;
}

export function toggleEntitySelection(entityId: EntityId | null): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn > state.turn.totalTurns) return state;
		if (!entityId) return state;
		return {
			...state,
			entities: state.entities.map((entity) => ({
				...entity,
				state: {
					...entity.state,
					selected: entity.id === entityId ? !entity.state.selected : false
				}
			}))
		};
	};
}
