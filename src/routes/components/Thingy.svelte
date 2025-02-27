<script lang="ts">
	/* eslint svelte/no-unused-svelte-ignore: "warn" */
	import type { MouseEventHandler } from 'svelte/elements';

	import { COLORS } from '$lib/constants/colors';
</script>

<div class="pointer-events-none flex h-full w-full items-center justify-center">
	<div
		class="h-5 w-5 rounded-full border-2"
		style:background-color={COLORS.thingy.light}
		style:border-color={COLORS.thingy.dark}
	></div>
</div>
