import type { Role } from './role';

export type Stats = {
	movement: number;
	attack: number;
	defense: number;
	health: number;
};

export type StatComponent = {
	stats: Stats;
};

export const ROLE_STATS: Record<Role, StatComponent> = {
	Fighter: { stats: { movement: 3, attack: 4, defense: 4, health: 10 } },
	Runner: { stats: { movement: 5, attack: 3, defense: 2, health: 8 } },
	Specialist: { stats: { movement: 3, attack: 0, defense: 2, health: 6 } }
};
