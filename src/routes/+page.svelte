<script lang="ts">
	import Board from './components/Board.svelte';
	import CharacterInfo from './components/CharacterInfo.svelte';
	import TurnInfo from './components/TurnInfo.svelte';
</script>

<div class="col-span-1"></div>
<div class="col-span-1 flex flex-col">
	<div class="h-50"><TurnInfo team="home" /></div>
	<CharacterInfo team="home" />
</div>
<div class="col-span-2 flex justify-center">
	<Board />
</div>
<div class="col-span-1 flex flex-col">
	<div class="h-50"><TurnInfo team="away" /></div>
	<CharacterInfo team="away" />
</div>
