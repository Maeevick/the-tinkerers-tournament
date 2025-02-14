export type Team = 'home' | 'away';
export type Role = 'Fighter' | 'Runner' | 'Specialist';

export type TeamComponent = {
	team: Team;
};

export type RoleComponent = {
	role: Role;
};

export type Stats = {
	movement: number;
};

export type StatComponent = {
	stats: Stats;
};
