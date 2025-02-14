import type { Role, StatComponent } from './types';

export const ROLE_STATS: Record<Role, StatComponent> = {
	Fighter: { stats: { movement: 3 } },
	Runner: { stats: { movement: 5 } },
	Specialist: { stats: { movement: 3 } }
};
