export type EntityId = string;
export type Position = {
	x: number;
	y: number;
};
export type Team = 'home' | 'away';
export type Role = 'Fighter' | 'Runner' | 'Specialist';

export type Character = {
	id: EntityId;
	team: Team;
	role: Role;
	position: Position;
};
