export type StateComponent = {
	state: {
		selected: boolean;
		remainingMovement: number;
		availableMoves: Map<string, number>;
	};
};
