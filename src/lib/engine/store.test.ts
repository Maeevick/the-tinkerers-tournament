import { describe, test, expect } from 'vitest';
import { get } from 'svelte/store';
import { gameStore } from './store';
import type { RoleComponent, TeamComponent } from '$lib/character/types';
import type { PositionComponent } from '$lib/board/types';
import type { Entity } from './types';

describe('GameState Initialization', () => {
	describe('should initialize teams entities correctly (1à characters as 2 fighters, 2 runners and 1 sepecialist', () => {
		const state = get(gameStore);
		expect(state.entities).toHaveLength(5 * 2);

		test('for the home team', () => {
			const homeTeam = state.entities.filter((e) => e.team === 'home');

			expect(homeTeam).toHaveLength(5);
			expect(homeTeam.filter((e) => e.role === 'Fighter')).toHaveLength(2);
			expect(homeTeam.filter((e) => e.role === 'Runner')).toHaveLength(2);
			expect(homeTeam.filter((e) => e.role === 'Specialist')).toHaveLength(1);
		});

		test('for the away team', () => {
			const awayTeam = state.entities.filter((e) => e.team === 'away');

			expect(awayTeam).toHaveLength(5);
			expect(awayTeam.filter((e) => e.role === 'Fighter')).toHaveLength(2);
			expect(awayTeam.filter((e) => e.role === 'Runner')).toHaveLength(2);
			expect(awayTeam.filter((e) => e.role === 'Specialist')).toHaveLength(1);
		});
	});

	describe('should position team entities correctly', () => {
		const state = get(gameStore);
		test('for the home team on the row 2', () => {
			const homeTeam = state.entities.filter((e) => e.team === 'home');

			homeTeam.forEach((entity) => {
				expect(entity.position.y).toBe(2);
			});
		});

		test('for the away team on the row 23', () => {
			const awayTeam = state.entities.filter((e) => e.team === 'away');

			awayTeam.forEach((entity) => {
				expect(entity.position.y).toBe(23);
			});
		});
	});

	test('should have correct horizontal positions for each role', () => {
		type FullCharacter = Entity & TeamComponent & RoleComponent & PositionComponent;

		const state = get(gameStore);

		const { fighters, runners, specialists } = (state.entities as FullCharacter[]).reduce(
			(a, e) => {
				if (e.role === 'Fighter') {
					a.fighters.push(e);
				}
				if (e.role === 'Runner') {
					a.runners.push(e);
				}
				if (e.role === 'Specialist') {
					a.specialists.push(e);
				}
				return a;
			},
			{
				fighters: [] as FullCharacter[],
				runners: [] as FullCharacter[],
				specialists: [] as FullCharacter[]
			}
		);

		expect(fighters.every((f: FullCharacter) => f.position.x === 3 || f.position.x === 5)).toBe(
			true
		);
		expect(runners.every((f: FullCharacter) => f.position.x === 1 || f.position.x === 7)).toBe(
			true
		);
		expect(specialists.every((f: FullCharacter) => f.position.x === 4)).toBe(true);
	});
});
