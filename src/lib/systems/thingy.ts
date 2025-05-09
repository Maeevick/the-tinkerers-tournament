import { GOAL_CAGES } from '$lib/constants/board';

import type { Position, PositionComponent } from '$lib/components/position';
import type { RoleComponent } from '$lib/components/role';
import type { StateComponent } from '$lib/components/state';
import type { StatComponent } from '$lib/components/stats';
import type { Team, TeamComponent } from '$lib/components/team';
import type { GameState, GameStateUpdater } from '$lib/engine/store';
import type { Entity, EntityId } from '$lib/entities';

// TODO: I know I have already this type in combat.ts but WET until I know what to do with it ;-)
type Character = Entity &
	TeamComponent &
	RoleComponent &
	PositionComponent &
	StatComponent &
	StateComponent;

// TODO: I know I have already this function more or less in combat.ts but WET until I know what to do with it ;-)
function getManathanDistance(entityPosition: Position, thingyPosition: Position): number {
	return (
		Math.abs(entityPosition.x - thingyPosition.x) + Math.abs(entityPosition.y - thingyPosition.y)
	);
}

function isPositionBlocked(state: GameState, pos: Position) {
	if (pos.x < 0 || pos.x >= 9 || pos.y <= 1 || pos.y >= 23) return true;

	return state.entities.some(
		(e) => !e.state.isDead && e.position.x === pos.x && e.position.y === pos.y
	);
}

function findFreePositionFromCenter(state: GameState) {
	const centerX = 5;
	const centerY = 12;

	for (let radius = 1; radius < 4; radius++) {
		for (let dx = -radius; dx <= radius; dx++) {
			const pos = { x: centerX + dx, y: centerY - radius };
			if (!isPositionBlocked(state, pos)) {
				return pos;
			}
		}

		for (let dy = -radius + 1; dy <= radius; dy++) {
			const pos = { x: centerX + radius, y: centerY + dy };
			if (!isPositionBlocked(state, pos)) {
				return pos;
			}
		}

		for (let dx = radius - 1; dx >= -radius; dx--) {
			const pos = { x: centerX + dx, y: centerY + radius };
			if (!isPositionBlocked(state, pos)) {
				return pos;
			}
		}

		for (let dy = radius - 1; dy >= -radius + 1; dy--) {
			const pos = { x: centerX - radius, y: centerY + dy };
			if (!isPositionBlocked(state, pos)) {
				return pos;
			}
		}
	}
	return { x: centerX, y: centerY };
}

export function bounce(state: GameState, pos: Position): Position {
	const DIRECTIONS = [
		{ x: -1, y: -1 },
		{ x: 0, y: -1 },
		{ x: 1, y: -1 },
		{ x: -1, y: 0 },
		{ x: 1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 }
	];

	const bounceDirection = DIRECTIONS[Math.floor(Math.random() * 8)];
	const bouncePosition = {
		x: pos.x + bounceDirection.x,
		y: pos.y + bounceDirection.y
	};

	let count = 0;
	const MAX_BOUNCE_TRY = 10;
	while (isPositionBlocked(state, bouncePosition) && count < MAX_BOUNCE_TRY) {
		const newBounceDirection = DIRECTIONS[Math.floor(Math.random() * 8)];

		bouncePosition.x = bouncePosition.x + newBounceDirection.x;
		bouncePosition.y = bouncePosition.y + newBounceDirection.y;

		count++;
	}
	if (count >= MAX_BOUNCE_TRY) {
		return findFreePositionFromCenter(state);
	}
	return bouncePosition;
}

function getAdjacentOpponentCount(state: GameState, entity: Character) {
	return state.entities.filter((e) => {
		return (
			e.team !== state.turn.activeTeam &&
			!e.state.isDown &&
			!e.state.isDead &&
			getManathanDistance(entity.position, e.position) === 1
		);
	}).length;
}

export function canPickup(entity: Character, state: GameState) {
	return (
		entity.team === state.turn.activeTeam &&
		!entity.state.isDead &&
		!entity.state.isDown &&
		state.thingy.carrierId === null &&
		getManathanDistance(entity.position, state.thingy.position) === 1
	);
}

export function pickup(entityId: EntityId): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		const entity = state.entities.find((e) => e.id === entityId);
		if (!entity) return state;

		if (!canPickup(entity, state)) return state;

		const dd = getAdjacentOpponentCount(state, entity) + 1;

		const pickup =
			entity.stats.dexterity === 0 ? 0 : Math.floor(Math.random() * entity.stats.dexterity) + 1;

		const success = pickup >= dd;
		return {
			...state,
			thingy: {
				...state.thingy,
				carrierId: success ? entityId : null,
				position: success ? entity.position : bounce(state, state.thingy.position)
			},
			entities: state.entities.map((entity) => {
				if (entity.id === entityId) {
					return {
						...entity,
						state: {
							...entity.state,
							isCarrier: success,
							availableReceivers: getAvailableReceivers(
								{
									...state,
									entities: state.entities.map((e) => {
										return e.id === entityId
											? {
													...e,
													state: {
														...e.state,
														isCarrier: success
													}
												}
											: e;
									})
								},
								entity.id
							)
						}
					};
				}
				return entity;
			})
		};
	};
}

export function getAvailableReceivers(state: GameState, entityId: EntityId): Set<string> {
	const entity = state.entities.find((e) => e.id === entityId);
	if (!entity || !entity.state.isCarrier || entity.state.remainingPassOrShot <= 0) return new Set();

	return new Set(
		state.entities
			.filter(
				(e) =>
					e.team === entity.team &&
					!e.state.isDead &&
					!e.state.isDown &&
					e.id !== entity.id &&
					getManathanDistance(entity.position, e.position) <= entity.stats.dexterity * 2
			)
			.map((e) => e.id)
	);
}

function canPass(carrier: Character, receiver: Character, state: GameState) {
	return (
		carrier &&
		receiver &&
		carrier.state.isCarrier &&
		carrier.team === state.turn.activeTeam &&
		carrier.team === receiver.team &&
		!carrier.state.isDead &&
		!carrier.state.isDown &&
		!receiver.state.isDead &&
		!receiver.state.isDown &&
		carrier.state.remainingPassOrShot > 0
	);
}

export function pass(carrier: Character, receiver: Character): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		if (!canPass(carrier, receiver, state)) return state;

		const passDD =
			getAdjacentOpponentCount(state, carrier) +
			Math.floor(getManathanDistance(carrier.position, receiver.position) / 2) +
			1;

		const passRoll =
			carrier.stats.dexterity === 0 ? 0 : Math.floor(Math.random() * carrier.stats.dexterity) + 1;

		const catchDD = getAdjacentOpponentCount(state, receiver) + 1;
		const catchRoll =
			receiver.stats.dexterity === 0 ? 0 : Math.floor(Math.random() * receiver.stats.dexterity) + 1;

		const success = passRoll >= passDD && catchRoll >= catchDD;

		return {
			...state,
			thingy: {
				...state.thingy,
				carrierId: success ? receiver.id : null,
				position: success
					? receiver.position
					: bounce(state, passRoll >= passDD ? receiver.position : carrier.position)
			},
			entities: state.entities.map((entity) => {
				if (entity.id === carrier.id) {
					return {
						...entity,
						state: {
							...entity.state,
							isCarrier: false,
							remainingPassOrShot: 0,
							availableReceivers: new Set()
						}
					};
				}
				if (entity.id === receiver.id) {
					return {
						...entity,
						state: {
							...entity.state,
							isCarrier: success
						}
					};
				}
				return entity;
			})
		};
	};
}

// FIXME: fix the x coordination double logic with Board.svelte
function getGoalPoints(position: Position, team: Team): number {
	return (
		GOAL_CAGES[team].find((cage) => cage.x === position.x + 1 && cage.y === position.y)?.points ?? 0
	);
}

function canShot(carrier: Character, state: GameState) {
	return (
		carrier &&
		carrier.state.isCarrier &&
		carrier.team === state.turn.activeTeam &&
		!carrier.state.isDead &&
		!carrier.state.isDown &&
		carrier.state.remainingPassOrShot > 0
	);
}

export function shot(carrier: Character, position: Position): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		if (!canShot(carrier, state)) return state;

		const shotDD =
			getAdjacentOpponentCount(state, carrier) +
			Math.floor(getManathanDistance(carrier.position, position) / 2) +
			1;

		const shotRoll =
			carrier.stats.dexterity === 0 ? 0 : Math.floor(Math.random() * carrier.stats.dexterity) + 1;

		const success = shotRoll >= shotDD;

		return {
			...state,
			thingy: {
				...state.thingy,
				carrierId: null,
				position: success ? position : bounce(state, carrier.position)
			},
			entities: state.entities.map((entity) => {
				if (entity.id === carrier.id) {
					return {
						...entity,
						state: {
							...entity.state,
							isCarrier: false,
							remainingPassOrShot: 0,
							availableReceivers: new Set()
						}
					};
				}
				return entity;
			}),
			score: {
				...state.score,
				[carrier.team]: success
					? state.score[carrier.team] +
						getGoalPoints(position, carrier.team === 'home' ? 'away' : 'home')
					: state.score[carrier.team],
				celebrating: success ? 'goal' : null
			}
		};
	};
}
