<script lang="ts">
	import type { Lane as LaneType } from '$lib/types/kanban';
	import { activeBoard, laneCounts, moveCard } from '$lib/stores/boards';
	import KanbanCard from './KanbanCard.svelte';
	import CardModal from './CardModal.svelte';

	interface Props {
		lane: LaneType;
	}

	let { lane }: Props = $props();

	let showAddModal = $state(false);
	let isDragOver = $state(false);

	let board = $derived($activeBoard);
	let count = $derived($laneCounts.get(lane.id) ?? 0);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;
		const cardId = e.dataTransfer?.getData('application/kanban-card-id');
		const fromLaneId = e.dataTransfer?.getData('application/kanban-lane-id');
		if (cardId && fromLaneId && board && fromLaneId !== lane.id) {
			moveCard(board.id, cardId, fromLaneId, lane.id);
		}
	}
</script>

<div
	class="flex min-w-72 flex-shrink-0 flex-col rounded-xl bg-slate-100 p-4 shadow transition {isDragOver ? 'ring-2 ring-slate-400 ring-offset-2' : ''}"
	role="region"
	aria-label="{lane.title} lane"
	data-lane-id={lane.id}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="font-semibold text-slate-800">{lane.title}</h2>
		<span
			class="rounded-full bg-slate-200 px-2 py-0.5 text-sm text-slate-600"
		>
			{count}
		</span>
	</div>

	<div class="flex flex-1 flex-col gap-3">
		{#each lane.cards as card (card.id)}
			<KanbanCard {card} laneId={lane.id} />
		{/each}
	</div>

	<button
		onclick={() => (showAddModal = true)}
		class="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
	>
		+ Add card
	</button>
</div>

{#if showAddModal && board}
	<CardModal
		mode="create"
		boardId={board.id}
		laneId={lane.id}
		onclose={() => (showAddModal = false)}
	/>
{/if}
