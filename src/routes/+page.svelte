<script lang="ts">
	import Board from './components/Board.svelte';
	import InfoPanel from './components/InfoPanel.svelte';
	import TurnInfo from './components/TurnInfo.svelte';
</script>

<div class="col-span-1"></div>
<div class="col-span-1 flex flex-col text-center">
	<TurnInfo team="home" player="1" />
	<InfoPanel team="home" />
</div>
<div class="col-span-2 flex justify-center">
	<Board />
</div>
<div class="col-span-1 flex flex-col text-center">
	<TurnInfo team="away" player="2" />
	<InfoPanel team="away" />
</div>
