<script lang="ts">
	import { goto } from '$app/navigation';
	import { boards, createBoard, addBoard } from '$lib/stores/boards';

	function handleNewBoard() {
		const board = createBoard('New Board');
		addBoard(board);
		goto(`/boards/${board.id}`);
	}
</script>

<div class="min-h-screen bg-slate-50 p-8">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-slate-800">Kanban Boards</h1>
		<p class="mt-2 text-slate-600">Create and manage your boards</p>
	</header>

	<button
		onclick={handleNewBoard}
		class="mb-6 rounded-xl bg-slate-800 px-4 py-2 text-white shadow transition hover:bg-slate-700"
	>
		+ New board
	</button>

	<div class="flex flex-wrap gap-4">
		{#each $boards as board (board.id)}
			<a
				href="/boards/{board.id}"
				class="block w-64 rounded-xl bg-white p-4 shadow transition hover:shadow-md"
			>
				<h2 class="font-semibold text-slate-800">{board.name}</h2>
				<p class="mt-1 text-sm text-slate-500">
					{board.lanes.length} lanes
				</p>
			</a>
		{:else}
			<p class="text-slate-500">No boards yet. Create one to get started.</p>
		{/each}
	</div>
</div>
