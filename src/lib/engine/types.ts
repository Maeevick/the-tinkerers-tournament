export type EntityId = string;

export type Entity = {
	id: EntityId;
};

export type Component = Record<string, unknown>;

export type System<T> = {
	name: string;
	update: (state: T) => T;
};
