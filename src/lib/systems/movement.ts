import type { GameState, GameStateUpdater } from '../engine/store';
import type { Entity, EntityId } from '$lib/entities';
import type { Position, PositionComponent } from '$lib/components/position';
import type { StateComponent } from '$lib/components/state';

import { COLUMNS, ROWS } from '$lib/constants/board';
import { bounce, getAvailableReceivers } from '$lib/systems/thingy';
import type { RoleComponent } from '$lib/components/role';
import type { StatComponent } from '$lib/components/stats';
import type { TeamComponent } from '$lib/components/team';

function initBlockedPositions(
	state: GameState,
	entity: Entity & PositionComponent & StateComponent
) {
	return new Set([
		...state.entities
			.filter(
				(e) =>
					e.id !== entity.id &&
					!e.state.isDead &&
					Math.abs(e.position.x - entity.position.x) <= entity.state.remainingMovement &&
					Math.abs(e.position.y - entity.position.y) <= entity.state.remainingMovement
			)
			.map((e) => `${e.position.x}-${e.position.y}`)
	]);
}

function initCostPerMove({ x, y }: Position) {
	return new Map<string, number>().set(`${x}-${y}`, 0);
}

function getNeighborsPositions({ x, y }: Position): Position[] {
	return [
		{ x: x + 1, y },
		{ x: x - 1, y },
		{ x, y: y + 1 },
		{ x, y: y - 1 }
	].filter(
		(pos) => pos.x >= 0 && pos.x < COLUMNS.length - 2 && pos.y > 1 && pos.y < ROWS.length - 2
	);
}

function exploreMoves(
	start: Position,
	current: Position,
	blocked: Set<string>,
	costPerMove: Map<string, number>,
	movement: number
): Map<string, number> {
	const currentCost = costPerMove.get(`${current.x}-${current.y}`) ?? 0;

	for (const neighborPosition of getNeighborsPositions(current)) {
		const key = `${neighborPosition.x}-${neighborPosition.y}`;
		const newCost = currentCost + 1;

		const hasEnoughMovement = newCost <= movement;
		const isFreeOfBlock = !blocked.has(key);
		const isUnvisited = !costPerMove.has(key);
		const isCheaperThanTheAlreadyVisited =
			costPerMove.has(key) && newCost < Number(costPerMove.get(key));

		if ((hasEnoughMovement && isFreeOfBlock && isUnvisited) || isCheaperThanTheAlreadyVisited) {
			exploreMoves(start, neighborPosition, blocked, costPerMove.set(key, newCost), movement);
		}
	}
	return costPerMove;
}

export function getAvailableMoves(
	state: GameState,
	entityId: EntityId | null
): Map<string, number> {
	if (!entityId) return new Map();

	const entity = state.entities.find((e) => e.id === entityId);
	if (!entity || entity.state.isDead) return new Map();

	return exploreMoves(
		entity.position,
		entity.position,
		initBlockedPositions(state, entity),
		initCostPerMove(entity.position),
		Math.max(0, entity.state.remainingMovement - Number(entity.state.isDown))
	);
}

function computeNextAvailableMoves(
	state: GameState,
	to: Position,
	entityId: EntityId,
	remainingMovement: number
) {
	return remainingMovement > 0
		? getAvailableMoves(
				{
					...state,
					entities: state.entities.map((e) => {
						return e.id === entityId
							? {
									...e,
									position: to,
									state: {
										...e.state,
										remainingMovement,
										availableMoves: new Map<string, number>(),
										isDown: false
									}
								}
							: e;
					})
				},
				entityId
			)
		: new Map<string, number>();
}

// I know I have already this type in combat.ts & thingy.ts but WET until I know what to do with it ;-)
type Character = Entity &
	TeamComponent &
	RoleComponent &
	PositionComponent &
	StatComponent &
	StateComponent;

// I know I have already this function more or less in combat.ts & thingy.ts but WET until I know what to do with it ;-)
function getManathanDistance(entityPosition: Position, thingyPosition: Position): number {
	return (
		Math.abs(entityPosition.x - thingyPosition.x) + Math.abs(entityPosition.y - thingyPosition.y)
	);
}

function getAdjacentOpponentHighestTackle(state: GameState, entity: Character) {
	return state.entities
		.filter((e) => {
			return (
				e.team !== state.turn.activeTeam &&
				!e.state.isDown &&
				!e.state.isDead &&
				getManathanDistance(entity.position, e.position) === 1
			);
		})
		.reduce((highestTackleValue, opponent) => {
			return Math.max(opponent.stats.tackle, highestTackleValue);
		}, 0);
}

export function move(entityId: EntityId | null, to: Position): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;
		if (!entityId) return state;

		const entity = state.entities.find((e) => e.id === entityId);
		if (!entity) return state;

		if (entity.state.isDown) return state;
		if (entity.state.isDead) return state;
		if (entity.team !== state.turn.activeTeam) return state;
		if (entity.position.x === to.x && entity.position.y === to.y) return state;
		if (!entity.state.availableMoves || !entity.state.availableMoves.has(`${to.x}-${to.y}`))
			return state;

		const highestTackleValue = getAdjacentOpponentHighestTackle(state, entity);
		const dodge = entity.stats.dodge === 0 ? 0 : Math.floor(Math.random() * entity.stats.dodge) + 1;
		const tackle =
			highestTackleValue === 0 ? 0 : Math.floor(Math.random() * highestTackleValue) + 1;

		if (tackle > dodge) {
			return {
				...state,
				thingy: entity.state.isCarrier
					? {
							...state.thingy,
							carrierId: null,
							position: bounce(state, entity.position)
						}
					: state.thingy,
				entities: state.entities.map((entity) =>
					entity.id === entityId
						? {
								...entity,
								state: {
									...entity.state,
									isDown: true,
									remainingMovement: 0,
									selected: false
								}
							}
						: entity
				)
			};
		}

		const remainingMovement =
			entity.state.remainingMovement -
			(entity.state.availableMoves.get(`${to.x}-${to.y}`) ?? 0) -
			Number(entity.state.isDown);

		return {
			...state,
			entities: state.entities.map((entity) => {
				return entity.id === entityId
					? {
							...entity,
							position: to,
							state: {
								...entity.state,
								remainingMovement,
								availableMoves: computeNextAvailableMoves(state, to, entityId, remainingMovement),
								isDown: false,
								availableReceivers: getAvailableReceivers(
									{
										...state,
										entities: state.entities.map((e) => {
											return e.id === entityId
												? {
														...e,
														position: to
													}
												: e;
										})
									},
									entityId
								)
							}
						}
					: entity;
			}),
			thingy: state.entities.find((e) => e.id === entityId && e.state.isCarrier)
				? { ...state.thingy, position: to }
				: state.thingy
		};
	};
}

export function standUp(entityId: EntityId): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		const entity = state.entities.find((e) => e.id === entityId);
		if (!entity) return state;
		if (!entity.state.isDown) return state;
		if (entity.state.isDead) return state;
		if (entity.team !== state.turn.activeTeam) return state;
		if (entity.state.remainingMovement < 1) return state;

		return {
			...state,
			entities: state.entities.map((entity) => {
				if (entity.id !== entityId) {
					return entity;
				}
				return {
					...entity,
					state: {
						...entity.state,
						remainingMovement: entity.state.remainingMovement - 1,
						isDown: false
					}
				};
			})
		};
	};
}
