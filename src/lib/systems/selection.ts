import type { GameState } from '$lib/engine/store';
import type { EntityId } from '$lib/entities';

export function getSelectedEntityId(state: GameState): EntityId | null {
	return state.entities.find((e) => e.state.selected)?.id ?? null;
}

export function toggleEntitySelection(state: GameState, entityId: EntityId | null): GameState {
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
}
