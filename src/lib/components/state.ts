import type { EntityId } from '$lib/entities';

export type StateComponent = {
	state: {
		selected: boolean;
		remainingMovement: number;
		availableMoves: Map<string, number>;
		availableReceivers: Set<EntityId>;
		remainingAttack: number;
		remainingPassOrShot: number;
		remainingAssault: number;
		isDown: boolean;
		remainingHealth: number;
		isDead: boolean;
		isCarrier: boolean;
	};
};
