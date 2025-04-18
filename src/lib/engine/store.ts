import { writable } from 'svelte/store';

import type { Entity } from '$lib/entities';

import type { PositionComponent } from '$lib/components/position';
import type { RoleComponent } from '$lib/components/role';
import type { StatComponent } from '$lib/components/stats';
import type { TeamComponent, Team } from '$lib/components/team';
import type { StateComponent } from '$lib/components/state';

import { ROLE_STATS } from '$lib/components/stats';

import { INITIAL_TURN, type TurnComponent } from '$lib/components/turn';
import { INITIAL_THINGY, type ThingyComponent } from '$lib/components/thingy';
import { INITIAL_SCORE, type ScoreComponent } from '$lib/components/score';

type EntitiesComponent = {
	entities: (Entity &
		TeamComponent &
		RoleComponent &
		PositionComponent &
		StatComponent &
		StateComponent)[];
};
export type GameState = EntitiesComponent & TurnComponent & ThingyComponent & ScoreComponent;

export type GameStateUpdater = (state: GameState) => GameState;

const createInitialTeam = (
	team: Team,
	baseRow: number
): (Entity &
	TeamComponent &
	RoleComponent &
	PositionComponent &
	StatComponent &
	StateComponent)[] => {
	return [
		{
			id: `${team[0]}1`,
			team,
			role: 'Fighter',
			position: { x: 3, y: baseRow },
			state: {
				selected: false,
				remainingMovement: ROLE_STATS.Fighter.stats.movement,
				availableMoves: new Map<string, number>(),
				availableReceivers: new Set<string>(),
				remainingAttack: 1,
				remainingPassOrShot: 1,
				remainingAssault: 0,
				isDown: false,
				remainingHealth: ROLE_STATS.Fighter.stats.health,
				isDead: false,
				isCarrier: false
			},
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}2`,
			team,
			role: 'Fighter',
			position: { x: 5, y: baseRow },
			state: {
				selected: false,
				remainingMovement: ROLE_STATS.Fighter.stats.movement,
				availableMoves: new Map<string, number>(),
				availableReceivers: new Set<string>(),
				remainingAttack: 1,
				remainingPassOrShot: 1,
				remainingAssault: 0,
				isDown: false,
				remainingHealth: ROLE_STATS.Fighter.stats.health,
				isDead: false,
				isCarrier: false
			},
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}3`,
			team,
			role: 'Runner',
			position: { x: 1, y: baseRow },
			state: {
				selected: false,
				remainingMovement: ROLE_STATS.Runner.stats.movement,
				availableMoves: new Map<string, number>(),
				availableReceivers: new Set<string>(),
				remainingAttack: 1,
				remainingPassOrShot: 1,
				remainingAssault: 1,
				isDown: false,
				remainingHealth: ROLE_STATS.Runner.stats.health,
				isDead: false,
				isCarrier: false
			},
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}4`,
			team,
			role: 'Runner',
			position: { x: 7, y: baseRow },
			state: {
				selected: false,
				remainingMovement: ROLE_STATS.Runner.stats.movement,
				availableMoves: new Map<string, number>(),
				availableReceivers: new Set<string>(),
				remainingAttack: 1,
				remainingPassOrShot: 1,
				remainingAssault: 1,
				isDown: false,
				remainingHealth: ROLE_STATS.Runner.stats.health,
				isDead: false,
				isCarrier: false
			},
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}5`,
			team,
			role: 'Specialist',
			position: { x: 4, y: baseRow },
			state: {
				selected: false,
				remainingMovement: ROLE_STATS.Specialist.stats.movement,
				availableMoves: new Map<string, number>(),
				availableReceivers: new Set<string>(),
				remainingAttack: 1,
				remainingPassOrShot: 1,
				remainingAssault: 0,
				isDown: false,
				remainingHealth: ROLE_STATS.Specialist.stats.health,
				isDead: false,
				isCarrier: false
			},
			...ROLE_STATS.Specialist
		}
	];
};

const createInitialState = (): GameState => {
	return {
		entities: [...createInitialTeam('home', 2), ...createInitialTeam('away', 22)],
		...INITIAL_TURN,
		...INITIAL_THINGY,
		...INITIAL_SCORE
	};
};

export const gameStore = writable<GameState>(createInitialState());
