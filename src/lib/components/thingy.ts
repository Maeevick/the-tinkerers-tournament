import type { EntityId } from '$lib/entities';
import type { Position } from './position';

export type Thingy = { id: EntityId; position: Position; carrierId: EntityId | null };

export type ThingyComponent = {
	thingy: Thingy;
};

export const INITIAL_THINGY: ThingyComponent = {
	thingy: { id: 'thingy', position: { x: 4, y: 12 }, carrierId: null }
};
