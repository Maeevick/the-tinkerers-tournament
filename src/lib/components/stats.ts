import type { Role } from './role';

export type Stats = {
	movement: number;
	attack: number;
	defense: number;
	dexterity: number;
	health: number;
	dodge: number;
	tackle: number;
};

export type StatComponent = {
	stats: Stats;
};

export const ROLE_STATS: Record<Role, StatComponent> = {
	Fighter: {
		stats: { movement: 3, attack: 4, defense: 4, health: 10, dexterity: 0, dodge: 2, tackle: 2 }
	},
	Runner: {
		stats: { movement: 5, attack: 3, defense: 2, health: 8, dexterity: 3, dodge: 4, tackle: 1 }
	},
	Specialist: {
		stats: { movement: 3, attack: 0, defense: 2, health: 6, dexterity: 4, dodge: 3, tackle: 0 }
	}
};
