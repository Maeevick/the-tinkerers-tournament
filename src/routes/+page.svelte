<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import type { Role, Team } from '$lib/types/ecs';

	const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

	const colors = {
		blueOnePoint: '#00a1de',
		blueThreePoint: '#0081b1',
		violetOnePoint: '#e22fbd',
		violetThreePoint: '#b5249a',
		greenLight: '#9db167',
		greenDark: '#7a8c52',
		whitesmoke: '#f0f0f0'
	};

	const fullRows = Array.from({ length: 26 }, (_, i) => i);
	const fullCols = Array.from({ length: 11 }, (_, i) => i);

	function getCellContent(row: number, col: number): string {
		if (col === 0 || col === 10) {
			if (row === 0 || row === 25) return '';
			return row.toString();
		}
		if (row === 0 || row === 25) {
			if (col === 0 || col === 10) return '';
			return columns[col - 1];
		}
		return '';
	}

	function getCellColor(row: number, col: number): string {
		if (col === 0 || col === 10 || row === 0 || row === 25) return colors.whitesmoke;

		if (row === 1) {
			const colLetter = columns[col - 1];
			if (colLetter === 'C' || colLetter === 'G') return colors.whitesmoke;
			if (colLetter === 'D' || colLetter === 'E' || colLetter === 'F') return colors.blueThreePoint;
			return colors.blueOnePoint;
		}
		if (row === 24) {
			const colLetter = columns[col - 1];
			if (colLetter === 'C' || colLetter === 'G') return colors.whitesmoke;
			if (colLetter === 'D' || colLetter === 'E' || colLetter === 'F')
				return colors.violetThreePoint;
			return colors.violetOnePoint;
		}

		return (col + row) % 2 === 0 ? colors.greenLight : colors.greenDark;
	}

	function getCellBorder(row: number, col: number): string {
		if (row === 0 && col === 0) return 'border border-black';
		if (row === 0) return `border-r border-y border-black`;
		if (col === 0) return `border-x border-b border-black`;
		return `border-r border-b border-black`;
	}

	function getDisplayLabel(role: Role): string {
		switch (role) {
			case 'Fighter':
				return 'F';
			case 'Runner':
				return 'R';
			case 'Specialist':
				return 'S';
		}
	}

	function getCharacterAt(x: number, y: number) {
		return $gameStore.characters.find((c) => c.position.x === x - 1 && c.position.y === y);
	}

	function getCharacterStyle(team: Team): string {
		const baseStyle = 'rounded-full flex items-center justify-center font-bold border-4';
		const teamColors = {
			home: 'border-[#00a1de] bg-[#00a1de]/50',
			away: 'border-[#e22fbd] bg-[#e22fbd]/50'
		};
		return `${baseStyle} ${teamColors[team]}`;
	}
</script>

<div class="flex-col bg-gray-100 p-4">
	<header class="flex-col items-start">
		<h1 class="text-center text-2xl">Welcome to The Tinkekerer's Tournament (TTT)</h1>
		<p class="text-center italic">
			Backstage at <a href="https://maeevick.substack.com" target="_blank" class="underline"
				>Maeevick's Bazaar</a
			> to read the adventure
		</p>
	</header>
	<main class="flex items-center justify-center p-4">
		<div class="grid grid-cols-11 gap-0">
			{#each fullRows as row}
				{#each fullCols as col}
					<div
						class={`flex h-8 w-8 items-center justify-center font-bold ${getCellBorder(row, col)}`}
						style:background-color={getCellColor(row, col)}
					>
						{#if row > 0 && row < 25 && col > 0 && col < 11}
							{#if getCharacterAt(col, row)}
								{@const character = getCharacterAt(col, row)}
								<div class={getCharacterStyle(character!.team)}>
									{getDisplayLabel(character!.role)}
								</div>
							{/if}
						{/if}
						{getCellContent(row, col)}
					</div>
				{/each}
			{/each}
		</div>
	</main>
	<footer class="p- flex-col items-start">
		<p class="text-center">
			Made with ❤️ and 😜 by <a href="https://github.com/Maeevick" target="_blank" class="underline"
				>Aurel / Maeevick</a
			>
		</p>
	</footer>
</div>
