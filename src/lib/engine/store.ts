import { writable } from 'svelte/store';
import type { PositionComponent } from '../board/types';
import type { Team, TeamComponent, RoleComponent, StatComponent } from '../character/types';
import type { Entity } from './types';
import { ROLE_STATS } from '$lib/character/constants';

export type GameState = {
	entities: (Entity & TeamComponent & RoleComponent & PositionComponent & StatComponent)[];
};

const createInitialTeam = (
	team: Team,
	baseRow: number
): (Entity & TeamComponent & RoleComponent & PositionComponent & StatComponent)[] => {
	return [
		{
			id: `${team[0]}1`,
			team,
			role: 'Fighter',
			position: { x: 3, y: baseRow },
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}2`,
			team,
			role: 'Fighter',
			position: { x: 5, y: baseRow },
			...ROLE_STATS.Fighter
		},
		{
			id: `${team[0]}3`,
			team,
			role: 'Runner',
			position: { x: 1, y: baseRow },
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}4`,
			team,
			role: 'Runner',
			position: { x: 7, y: baseRow },
			...ROLE_STATS.Runner
		},
		{
			id: `${team[0]}5`,
			team,
			role: 'Specialist',
			position: { x: 4, y: baseRow },
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
