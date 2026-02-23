<script lang="ts">
	import type { Card } from '$lib/types/kanban';
	import { deleteCard } from '$lib/stores/boards';
	import { activeBoard } from '$lib/stores/boards';
	import CardModal from './CardModal.svelte';

	interface Props {
		card: Card;
		laneId: string;
	}

	let { card, laneId }: Props = $props();

	let showEditModal = $state(false);

	let board = $derived($activeBoard);

	function formatDate(ts: number): string {
		return new Date(ts).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleDelete() {
		if (board && confirm('Delete this card?')) {
			deleteCard(board.id, card.id);
		}
	}

	function handleDragStart(e: DragEvent) {
		e.dataTransfer!.setData('application/kanban-card-id', card.id);
		e.dataTransfer!.setData('application/kanban-lane-id', laneId);
		e.dataTransfer!.effectAllowed = 'move';
	}
</script>

<div
	class="cursor-grab rounded-xl bg-white p-4 shadow transition hover:shadow-md active:cursor-grabbing"
	role="article"
	draggable="true"
	ondragstart={handleDragStart}
>
	<div class="flex items-start justify-between gap-2">
		<div class="min-w-0 flex-1">
			<h3 class="font-medium text-slate-800">{card.title}</h3>
			{#if card.description}
				<p class="mt-1 text-sm text-slate-600 line-clamp-2">{card.description}</p>
			{/if}
			<p class="mt-2 text-xs text-slate-400">{formatDate(card.createdAt)}</p>
		</div>
		<div class="flex gap-1">
			<button
				onclick={() => (showEditModal = true)}
				class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
				aria-label="Edit card"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</button>
			<button
				onclick={handleDelete}
				class="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
				aria-label="Delete card"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		</div>
	</div>
</div>

{#if showEditModal && board}
	<CardModal
		mode="edit"
		boardId={board.id}
		laneId={laneId}
		{card}
		onclose={() => (showEditModal = false)}
	/>
{/if}
