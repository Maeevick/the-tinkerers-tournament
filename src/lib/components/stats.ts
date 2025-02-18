import type { Role } from './role';

export type Stats = {
	movement: number;
};

export type StatComponent = {
	stats: Stats;
};

export const ROLE_STATS: Record<Role, StatComponent> = {
	Fighter: { stats: { movement: 3 } },
	Runner: { stats: { movement: 5 } },
	Specialist: { stats: { movement: 3 } }
};
