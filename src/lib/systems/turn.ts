import type { GameState } from '$lib/engine/store';

export function endTurn() {
	return (state: GameState): GameState => ({
		...state,
		entities: state.entities.map((entity) => ({
			...entity,
			state: {
				...entity.state,
				selected: false,
				remainingMovement: entity.stats.movement
			}
		})),
		turn: {
			...state.turn,
			activeTeam: state.turn.activeTeam === 'home' ? 'away' : 'home',
			currentTurn: state.turn.currentTurn + 0.5
		}
	});
}
