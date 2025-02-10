<script lang="ts">
	const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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
	const fullCols = Array.from({ length: 10 }, (_, i) => i);

	function getCellContent(row: number, col: number): string {
		if (col === 0 || col === 9) {
			if (row === 0 || row === 25) return '';
			return row.toString();
		}
		if (row === 0 || row === 25) {
			if (col === 0 || col === 9) return '';
			return columns[col - 1];
		}
		return '';
	}

	function getCellColor(row: number, col: number): string {
		if (col === 0 || col === 9 || row === 0 || row === 25) return colors.whitesmoke;

		if (row === 1) {
			const colLetter = columns[col - 1];
			if (colLetter === 'C' || colLetter === 'F') return colors.whitesmoke;
			if (colLetter === 'D' || colLetter === 'E') return colors.blueThreePoint;
			return colors.blueOnePoint;
		}
		if (row === 24) {
			const colLetter = columns[col - 1];
			if (colLetter === 'C' || colLetter === 'F') return colors.whitesmoke;
			if (colLetter === 'D' || colLetter === 'E') return colors.violetThreePoint;
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
</script>

<div class="h-screen flex-col bg-gray-100 pt-4">
	<header class="flex-col items-start">
		<h1 class="text-center text-2xl">Welcome to The Tinkekerer's Tournament (TTT)</h1>
		<p class="text-center italic">
			Backstage at <a href="https://maeevick.substack.com" target="_blank" class="underline"
				>Maeevick's Bazaar</a
			> to read the adventure
		</p>
	</header>
	<main class="flex items-center justify-center p-2">
		<div class="grid grid-cols-10 gap-0">
			{#each fullRows as row}
				{#each fullCols as col}
					<div
						class={`w-full flex items-center justify-center font-bold ${getCellBorder(row, col)}`}
						style:background-color={getCellColor(row, col)}
					>
						{getCellContent(row, col)}
					</div>
				{/each}
			{/each}
		</div>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
