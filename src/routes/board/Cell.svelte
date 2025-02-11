<script lang="ts">
	import type { Position } from '$lib/board/types';
	import { COLORS, COLUMNS } from '$lib/board/constants';

	export let position: Position;
	export let label: string = '';

	function getCellBorder(x: number, y: number): string {
		if (y === 0 && x === 0) return 'border border-black';
		if (y === 0) return 'border-r border-y border-black';
		if (x === 0) return 'border-x border-b border-black';
		return 'border-r border-b border-black';
	}

	function getCellColor(x: number, y: number): string {
		if (x === 0 || x === 10 || y === 0 || y === 25) return COLORS.stands;

		if (y === 1) {
			const colLetter = COLUMNS[x - 1];
			if (colLetter === 'C' || colLetter === 'G') return COLORS.stands;
			if (colLetter === 'D' || colLetter === 'E' || colLetter === 'F') return COLORS.home.dark;
			return COLORS.home.light;
		}

		if (y === 24) {
			const colLetter = COLUMNS[x - 1];
			if (colLetter === 'C' || colLetter === 'G') return COLORS.stands;
			if (colLetter === 'D' || colLetter === 'E' || colLetter === 'F') return COLORS.away.dark;
			return COLORS.away.light;
		}

		return (x + y) % 2 === 0 ? COLORS.field.light : COLORS.field.dark;
	}
</script>

<div
	class={`flex h-8 w-8 items-center justify-center font-bold ${getCellBorder(position.x, position.y)}`}
	style:background-color={getCellColor(position.x, position.y)}
>
	{label}
	<slot />
</div>
