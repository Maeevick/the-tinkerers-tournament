<script lang="ts">
	/* eslint svelte/no-unused-svelte-ignore: "warn" */
	import type { MouseEventHandler } from 'svelte/elements';

	import type { Role } from '$lib/components/role';
	import type { Team } from '$lib/components/team';

	let { index, team, role, isSelected, onclick } = $props<{
		index: number;
		team: Team;
		role: Role;
		isSelected: boolean;
		onclick: MouseEventHandler<HTMLDivElement>;
	}>();

	const getDisplayLabel = (role: Role): string => {
		switch (role) {
			case 'Fighter':
				return 'F';
			case 'Runner':
				return 'R';
			case 'Specialist':
				return 'S';
		}
	};

	function getCharacterStyle(team: Team, selected: boolean): string {
		const baseStyle = `h-full w-full rounded-full flex items-center justify-center font-bold border-4 ${selected ? 'text-white cursor-grab' : 'text-black cursor-pointer'}`;
		const teamColors = {
			home: `border-[#00a1de] ${selected ? 'bg-[#00a1de]' : 'bg-[#00a1de]/50'}`,
			away: `border-[#e22fbd] ${selected ? 'bg-[#e22fbd]' : 'bg-[#e22fbd]/50'}`
		};
		return `${baseStyle} ${teamColors[team]}`;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events (keyboard support is not planned yet) -->
<div role="gridcell" tabindex={index} class={getCharacterStyle(team, isSelected)} {onclick}>
	{getDisplayLabel(role)}
</div>
