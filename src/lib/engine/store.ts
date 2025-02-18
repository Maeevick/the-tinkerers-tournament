import { writable } from 'svelte/store';

import type { Entity } from '../entities';

import type { PositionComponent } from '$lib/components/position';
import type { RoleComponent } from '$lib/components/role';
import type { StatComponent } from '$lib/components/stats';
import type { TeamComponent, Team } from '$lib/components/team';
import type { StateComponent } from '$lib/components/state';

import { ROLE_STATS } from '$lib/components/stats';

export type GameState = {
	entities: (Entity &
		TeamComponent &
		RoleComponent &
		PositionComponent &
		StatComponent &
		StateComponent)[];
};

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
			state: { selected: false, remainingMovement: ROLE_STATS.Fighter.stats.movement },
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}2`,
			team,
			role: 'Fighter',
			position: { x: 5, y: baseRow },
			state: { selected: false, remainingMovement: ROLE_STATS.Fighter.stats.movement },
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}3`,
			team,
			role: 'Runner',
			position: { x: 1, y: baseRow },
			state: { selected: false, remainingMovement: ROLE_STATS.Runner.stats.movement },
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}4`,
			team,
			role: 'Runner',
			position: { x: 7, y: baseRow },
			state: { selected: false, remainingMovement: ROLE_STATS.Runner.stats.movement },
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}5`,
			team,
			role: 'Specialist',
			position: { x: 4, y: baseRow },
			state: { selected: false, remainingMovement: ROLE_STATS.Specialist.stats.movement },
			...ROLE_STATS.Specialist
		}
	];
};

const createInitialState = (): GameState => {
	return {
		entities: [...createInitialTeam('home', 2), ...createInitialTeam('away', 23)]
	};
};

export const gameStore = writable<GameState>(createInitialState());
