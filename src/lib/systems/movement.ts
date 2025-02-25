import type { GameState, GameStateUpdater } from '../engine/store';
import type { Entity, EntityId } from '$lib/entities';
import type { Position, PositionComponent } from '$lib/components/position';
import type { StateComponent } from '$lib/components/state';

import { COLUMNS, ROWS } from '$lib/constants/board';

function initBlockedPositions(
	state: GameState,
	entity: Entity & PositionComponent & StateComponent
) {
	return new Set(
		state.entities
			.filter(
				(e) =>
					e.id !== entity.id &&
					!e.state.isDead &&
					Math.abs(e.position.x - entity.position.x) <= entity.state.remainingMovement &&
					Math.abs(e.position.y - entity.position.y) <= entity.state.remainingMovement
			)
			.map((e) => `${e.position.x}-${e.position.y}`)
	);
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

export function move(entityId: EntityId | null, to: Position): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;
		if (!entityId) return state;

		const entity = state.entities.find((e) => e.id === entityId);
		if (!entity) return state;

		if (entity.state.isDead) return state;
		if (entity.team !== state.turn.activeTeam) return state;
		if (entity.position.x === to.x && entity.position.y === to.y) return state;
		if (!entity.state.availableMoves || !entity.state.availableMoves.has(`${to.x}-${to.y}`))
			return state;

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
								isDown: false
							}
						}
					: entity;
			})
		};
	};
}
