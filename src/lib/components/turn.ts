import type { Team } from './team';

export type TurnComponent = {
	turn: {
		activeTeam: Team;
		currentTurn: number;
		totalTurns: number;
	};
};

export const INITIAL_TURN: TurnComponent = {
	turn: {
		activeTeam: 'home',
		currentTurn: 1,
		totalTurns: 15
	}
};
