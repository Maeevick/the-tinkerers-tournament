export type ScoreComponent = {
	score: {
		home: number;
		away: number;
		celebrating: null | 'goal' | 'kill' | 'surprise';
	};
};

export const INITIAL_SCORE = { score: { home: 0, away: 0, celebrating: null } };
