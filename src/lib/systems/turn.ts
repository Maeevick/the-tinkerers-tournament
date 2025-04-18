import type { GameState } from '$lib/engine/store';

import { TURN_DURATION_IN_SEC } from '$lib/components/turn';
import { INITIAL_THINGY } from '$lib/components/thingy';

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
					remainingAssault: entity.role === 'Runner' ? 1 : 0,
					remainingPassOrShot: 1
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

export function resetAfterGoal() {
	return (state: GameState): GameState => {
		if (state.score.celebrating !== 'goal') return state;
		const BASE_COLULMS = {
			'1': 3,
			'2': 5,
			'3': 1,
			'4': 7,
			'5': 4
		};
		return {
			...state,
			score: { ...state.score, celebrating: null },
			entities: state.entities.map((entity) => {
				if (!entity.state.isDead) {
					const key = entity.id[1] as '1' | '2' | '3' | '4' | '5';
					return {
						...entity,
						position: {
							x: BASE_COLULMS[key] as number,
							y: entity.team === 'home' ? 2 : 22
						},
						state: { ...entity.state, isDown: false, isCarrier: false }
					};
				}
				return entity;
			}),
			...INITIAL_THINGY
		};
	};
}
