import type { Entity } from '$lib/engine/types';

export type Team = 'home' | 'away';
export type Role = 'Fighter' | 'Runner' | 'Specialist';

export type TeamComponent = {
	team: Team;
};

export type RoleComponent = {
	role: Role;
};

export type Character = Entity & TeamComponent & RoleComponent;
