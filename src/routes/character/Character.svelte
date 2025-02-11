<script lang="ts">
	import type { Team, Role } from '$lib/character/types';

	export let team: Team;
	export let role: Role;

	const getDisplayLabel = (r: Role): string => {
		switch (r) {
			case 'Fighter':
				return 'F';
			case 'Runner':
				return 'R';
			case 'Specialist':
				return 'S';
		}
	};

	function getCharacterStyle(t: Team): string {
		const baseStyle =
			'h-full w-full rounded-full flex items-center justify-center font-bold border-4';
		const teamColors = {
			home: 'border-[#00a1de] bg-[#00a1de]/50',
			away: 'border-[#e22fbd] bg-[#e22fbd]/50'
		};
		return `${baseStyle} ${teamColors[t]}`;
	}
</script>

<div class={getCharacterStyle(team)}>
	{getDisplayLabel(role)}
</div>
