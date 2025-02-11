import { writable } from 'svelte/store';
import type { Position, PositionComponent } from '../board/types';
import type { Team, Character, TeamComponent, RoleComponent } from '../character/types';
import type { Entity } from './types';

type GameState = {
	entities: (Entity & TeamComponent & RoleComponent & PositionComponent)[];
};

const createInitialTeam = (team: Team, baseRow: number): (Character & { position: Position })[] => {
	return [
		{ id: `${team[0]}1`, team, role: 'Fighter', position: { x: 3, y: baseRow } },
		{ id: `${team[0]}2`, team, role: 'Fighter', position: { x: 5, y: baseRow } },
		{ id: `${team[0]}3`, team, role: 'Runner', position: { x: 1, y: baseRow } },
		{ id: `${team[0]}4`, team, role: 'Runner', position: { x: 7, y: baseRow } },
		{ id: `${team[0]}5`, team, role: 'Specialist', position: { x: 4, y: baseRow } }
	];
};

const createInitialState = (): GameState => {
	return {
		entities: [...createInitialTeam('home', 2), ...createInitialTeam('away', 23)]
	};
};

export const gameStore = writable<GameState>(createInitialState());
