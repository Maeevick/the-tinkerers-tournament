import type { Position, PositionComponent } from '$lib/components/position';
import type { RoleComponent } from '$lib/components/role';
import type { StateComponent } from '$lib/components/state';
import type { StatComponent } from '$lib/components/stats';
import type { TeamComponent } from '$lib/components/team';
import type { GameState, GameStateUpdater } from '$lib/engine/store';
import type { Entity, EntityId } from '$lib/entities';

// I know I have already this type in combat.ts but WET until I know what to do with it ;-)
type PickingCharacter = Entity &
	TeamComponent &
	RoleComponent &
	PositionComponent &
	StatComponent &
	StateComponent;

// I know I have already this function more or less in combat.ts but WET until I know what to do with it ;-)
function getManathanDistance(entityPosition: Position, thingyPosition: Position): number {
	return (
		Math.abs(entityPosition.x - thingyPosition.x) + Math.abs(entityPosition.y - thingyPosition.y)
	);
}

export function canPickup(entity: PickingCharacter, state: GameState) {
	return (
		entity.team === state.turn.activeTeam &&
		!entity.state.isDead &&
		!entity.state.isDown &&
		state.thingy.carrierId === null &&
		getManathanDistance(entity.position, state.thingy.position) === 1
	);
}

export function pickup(entityId: EntityId | null): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;
		if (!entityId) return state;

		const entity = state.entities.find((e) => e.id === entityId);
		if (!entity) return state;

		if (!canPickup(entity, state)) return state;

		const dd =
			state.entities.filter((e) => {
				return (
					e.team !== state.turn.activeTeam &&
					!e.state.isDown &&
					!e.state.isDead &&
					getManathanDistance(entity.position, e.position) === 1
				);
			}).length + 2;

		const pickup =
			entity.stats.dexterity === 0 ? 0 : Math.floor(Math.random() * entity.stats.dexterity) + 1;

		const isSuccess = pickup >= dd;

		return {
			...state,
			thingy: {
				...state.thingy,
				carrierId: isSuccess ? entityId : null,
				position: isSuccess ? entity.position : state.thingy.position
			},
			entities: state.entities.map((entity) => {
				if (entity.id === entityId) {
					return {
						...entity,
						state: {
							...entity.state,
							isCarrier: isSuccess
						}
					};
				}
				return entity;
			})
		};
	};
}
