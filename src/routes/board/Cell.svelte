<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { Position } from '$lib/components/position';

	import { COLORS } from '$lib/constants/colors';
	import { COLUMNS, ROWS } from '$lib/constants/board';

	let { position, highlighted, children } = $props<{
		position: Position;
		highlighted: Set<string>;
		children: Snippet;
	}>();

	function getCellContent(x: number, y: number): string {
		if (x === 0 || x === COLUMNS.length - 1) {
			if (y === 0 || y === ROWS.length - 1) return '';
			return ROWS[y];
		}
		if (y === 0 || y === ROWS.length - 1) {
			if (x === 0 || x === COLUMNS.length - 1) return '';
			return COLUMNS[x];
		}
		return '';
	}

	function getCellBorder(x: number, y: number): string {
		if (y === 0 && x === 0) return 'border border-black';
		if (y === 0) return 'border-r border-y border-black';
		if (x === 0) return 'border-x border-b border-black';
		return 'border-r border-b border-black';
	}

	function getCellColor(x: number, y: number, highlighted: boolean): string {
		if (highlighted) return COLORS.field.highlight;
		if (x === 0 || x === 10 || y === 0 || y === 25) return COLORS.stands;

		if (y === 1) {
			const label = COLUMNS[x];
			if (label === 'C' || label === 'G') return COLORS.stands;
			if (label === 'D' || label === 'E' || label === 'F') return COLORS.home.dark;
			return COLORS.home.light;
		}

		if (y === 24) {
			const label = COLUMNS[x];
			if (label === 'C' || label === 'G') return COLORS.stands;
			if (label === 'D' || label === 'E' || label === 'F') return COLORS.away.dark;
			return COLORS.away.light;
		}

		return (x + y) % 2 === 0 ? COLORS.field.light : COLORS.field.dark;
	}

	function isHighlighted(x: number, y: number) {
		return highlighted.has(`${x - 1}-${y}`);
	}
</script>

<div
	class={`flex h-8 w-8 items-center justify-center font-bold ${getCellBorder(position.x, position.y)}`}
	style:background-color={getCellColor(
		position.x,
		position.y,
		isHighlighted(position.x, position.y)
	)}
>
	{getCellContent(position.x, position.y)}
	{@render children()}
</div>
