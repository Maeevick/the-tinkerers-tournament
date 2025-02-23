import type { Team } from './team';

export type TurnComponent = {
	turn: {
		activeTeam: Team;
		currentTurn: number;
		totalTurns: number;
		timeLeft: number;
	};
};

export const TURN_DURATION_IN_SEC = 30;
export const WARNING_THRESHOLD = 10;

export const INITIAL_TURN: TurnComponent = {
	turn: {
		activeTeam: 'home',
		currentTurn: 1,
		totalTurns: 15,
		timeLeft: TURN_DURATION_IN_SEC
	}
};
