import type { GameState } from '$lib/engine/store';

import { TURN_DURATION_IN_SEC } from '$lib/components/turn';

export function updateTimer() {
	return (state: GameState): GameState => ({
		...state,
		turn: {
			...state.turn,
			timeLeft: Math.max(0, state.turn.timeLeft - 1)
		}
	});
}

export function endTurn() {
	return (state: GameState): GameState => ({
		...state,
		entities: state.entities.map((entity) => {
			if (entity.state.isDead) {
				return entity;
			}
			return {
				...entity,
				state: {
					...entity.state,
					selected: false,
					remainingMovement: entity.stats.movement,
					remainingAttack: 1,
					remainingPass: 1
				}
			};
		}),
		turn: {
			...state.turn,
			activeTeam: state.turn.activeTeam === 'home' ? 'away' : 'home',
			currentTurn: state.turn.currentTurn + 0.5,
			timeLeft: TURN_DURATION_IN_SEC
		}
	});
}
