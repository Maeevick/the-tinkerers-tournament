import type { GameState, GameStateUpdater } from '$lib/engine/store';
import type { Entity } from '$lib/entities';
import type { Position, PositionComponent } from '$lib/components/position';
import type { RoleComponent } from '$lib/components/role';
import type { StateComponent } from '$lib/components/state';
import type { StatComponent } from '$lib/components/stats';
import type { TeamComponent } from '$lib/components/team';

import { bounce } from '$lib/systems/thingy';

type FightingCharacter = Entity &
	TeamComponent &
	RoleComponent &
	PositionComponent &
	StatComponent &
	StateComponent;

function getManathanDistance(attackerPosition: Position, defenserPosition: Position): number {
	return (
		Math.abs(attackerPosition.x - defenserPosition.x) +
		Math.abs(attackerPosition.y - defenserPosition.y)
	);
}

export function canAttack(
	attacker: FightingCharacter,
	defenser: FightingCharacter,
	state: GameState
): boolean {
	return (
		!attacker.state.isDead &&
		!attacker.state.isDown &&
		!attacker.state.isCarrier &&
		!!attacker.state.remainingAttack &&
		!defenser.state.isDown &&
		attacker.team !== defenser.team &&
		attacker.team === state.turn.activeTeam &&
		getManathanDistance(attacker.position, defenser.position) === 1
	);
}

export function attack(attacker: FightingCharacter, defenser: FightingCharacter): GameStateUpdater {
	return (state: GameState) => {
		if (state.turn.currentTurn >= state.turn.totalTurns) return state;

		if (!canAttack(attacker, defenser, state)) return state;

		const attack =
			attacker.stats.attack === 0 ? 0 : Math.floor(Math.random() * attacker.stats.attack) + 1;
		const defense =
			defenser.stats.defense === 0 ? 0 : Math.floor(Math.random() * defenser.stats.defense) + 1;

		const success = attack >= defense;
		const damage = Math.max(0, attack - defense);
		const isDefenserDead = success && defenser.state.remainingHealth - damage <= 0;

		return {
			...state,
			thingy: {
				...state.thingy,
				carrierId: success && defenser.state.isCarrier ? null : state.thingy.carrierId,
				position:
					success && defenser.state.isCarrier
						? bounce(state, defenser.position)
						: state.thingy.position
			},
			score: {
				...state.score,
				[attacker.team]: isDefenserDead
					? state.score[attacker.team] + 1
					: state.score[attacker.team],
				celebrating: isDefenserDead ? 'kill' : null
			},
			entities: state.entities.map((entity) => {
				if (entity.id === attacker.id) {
					return {
						...entity,
						state: {
							...entity.state,
							remainingMovement: success ? entity.state.remainingMovement : 0,
							remainingAttack: 0
						}
					};
				}
				if (entity.id === defenser.id && success) {
					const remainingHealth = entity.state.remainingHealth - damage;
					return {
						...entity,
						state: {
							...entity.state,
							isDown: true,
							remainingHealth,
							canRegenIn: 1,
							isDead: isDefenserDead,
							remainingMovement: isDefenserDead ? 0 : entity.state.remainingMovement,
							remainingAttack: isDefenserDead ? 0 : entity.state.remainingAttack,
							isCarrier: false
						}
					};
				}
				return entity;
			})
		};
	};
}
