import { writable } from 'svelte/store';

import type { Character } from '../types/ecs';

type GameState = {
	characters: Character[];
};

const createInitialState = (): GameState => {
	const homeTeam: Character[] = [
		{ id: 'h1', team: 'home', role: 'Fighter', position: { x: 3, y: 2 } },
		{ id: 'h2', team: 'home', role: 'Fighter', position: { x: 5, y: 2 } },
		{ id: 'h3', team: 'home', role: 'Runner', position: { x: 1, y: 2 } },
		{ id: 'h4', team: 'home', role: 'Runner', position: { x: 7, y: 2 } },
		{ id: 'h5', team: 'home', role: 'Specialist', position: { x: 4, y: 2 } }
	];

	const awayTeam: Character[] = [
		{ id: 'a1', team: 'away', role: 'Fighter', position: { x: 3, y: 23 } },
		{ id: 'a2', team: 'away', role: 'Fighter', position: { x: 5, y: 23 } },
		{ id: 'a3', team: 'away', role: 'Runner', position: { x: 1, y: 23 } },
		{ id: 'a4', team: 'away', role: 'Runner', position: { x: 7, y: 23 } },
		{ id: 'a5', team: 'away', role: 'Specialist', position: { x: 4, y: 23 } }
	];

	return {
		characters: [...homeTeam, ...awayTeam]
	};
};

export const gameStore = writable<GameState>(createInitialState());
