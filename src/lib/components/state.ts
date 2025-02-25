export type StateComponent = {
	state: {
		selected: boolean;
		remainingMovement: number;
		availableMoves: Map<string, number>;
		remainingAttack: number;
		isDown: boolean;
		remainingHealth: number;
		isDead: boolean;
	};
};
