<script lang="ts">
	import type { Card } from '$lib/types/kanban';
	import { addCard, updateCard } from '$lib/stores/boards';

	type Mode = 'create' | 'edit';

	interface Props {
		mode: Mode;
		boardId: string;
		laneId: string;
		card?: Card;
		onclose: () => void;
	}

	let { mode, boardId, laneId, card, onclose }: Props = $props();

	let title = $state('');
	let description = $state('');
	let initialized = false;

	$effect(() => {
		if (initialized) return;
		if (mode === 'edit' && card) {
			title = card.title;
			description = card.description;
		}
		initialized = true;
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (mode === 'create') {
			addCard(boardId, laneId, title.trim() || 'Untitled', description.trim());
		} else if (card) {
			updateCard(boardId, card.id, {
				title: title.trim() || 'Untitled',
				description: description.trim()
			});
		}
		onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
	onclick={handleBackdropClick}
	onkeydown={(e) => e.key === 'Escape' && onclose()}
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
		role="document"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
	>
		<h2 id="modal-title" class="text-lg font-semibold text-slate-800">
			{mode === 'create' ? 'Add card' : 'Edit card'}
		</h2>

		<form onsubmit={handleSubmit} class="mt-4 space-y-4">
			<div>
				<label for="card-title" class="block text-sm font-medium text-slate-700"> Title </label>
				<input
					id="card-title"
					type="text"
					bind:value={title}
					class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
					placeholder="Card title"
				/>
			</div>
			<div>
				<label for="card-description" class="block text-sm font-medium text-slate-700">
					Description
				</label>
				<textarea
					id="card-description"
					bind:value={description}
					rows="3"
					class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
					placeholder="Card description"
				></textarea>
			</div>
			<div class="flex justify-end gap-2">
				<button
					type="button"
					onclick={onclose}
					class="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
				>
					{mode === 'create' ? 'Add' : 'Save'}
				</button>
			</div>
		</form>
	</div>
</div>
