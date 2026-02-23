<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { activeBoardId, activeBoard, updateBoard } from '$lib/stores/boards';
	import Lane from '$lib/components/Lane.svelte';

	let id = $derived($page.params.id);

	$effect(() => {
		activeBoardId.set(id);
		return () => activeBoardId.set(null);
	});

	let board = $derived($activeBoard);
	let isEditingName = $state(false);
	let draftName = $state('');
	let nameInput: HTMLInputElement | undefined = $state();

	function startEditing() {
		draftName = board?.name ?? '';
		isEditingName = true;
	}

	$effect(() => {
		if (isEditingName && nameInput) {
			nameInput.focus();
			nameInput.select();
		}
	});

	function saveName() {
		if (board && draftName.trim()) {
			updateBoard(board.id, (b) => ({ ...b, name: draftName.trim() }));
		}
		isEditingName = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') saveName();
		if (e.key === 'Escape') {
			draftName = board?.name ?? '';
			isEditingName = false;
		}
	}
</script>

{#if !board}
	<div class="flex min-h-screen items-center justify-center bg-slate-50">
		<div class="rounded-xl bg-white p-8 shadow">
			<h2 class="text-xl font-semibold text-slate-800">Board not found</h2>
			<p class="mt-2 text-slate-600">This board may have been deleted.</p>
			<button
				onclick={() => goto('/')}
				class="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
			>
				Back to boards
			</button>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-slate-50 p-6">
		<header class="mb-6 flex items-center gap-4">
			<a
				href="/"
				class="text-slate-600 transition hover:text-slate-800"
				aria-label="Back to boards"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</a>
			{#if isEditingName}
				<input
					type="text"
					bind:value={draftName}
					onblur={saveName}
					onkeydown={handleKeydown}
					class="text-2xl font-bold text-slate-800 rounded px-2 py-1 -mx-2 -my-1 border border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
					aria-label="Board name"
				/>
			{:else}
				<button
					onclick={startEditing}
					class="group flex items-center gap-2 rounded px-2 py-1 -mx-2 -my-1 text-left hover:bg-slate-100 transition"
				>
					<h1 class="text-2xl font-bold text-slate-800">{board.name}</h1>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
					</svg>
				</button>
			{/if}
		</header>

		<div class="flex gap-4 overflow-x-auto pb-4">
			{#each board.lanes as lane (lane.id)}
				<Lane {lane} />
			{/each}
		</div>
	</div>
{/if}
