import { writable, derived } from 'svelte/store';
import type { Board } from '$lib/types/kanban';
import { DEFAULT_LANES } from '$lib/types/kanban';

const STORAGE_KEY = 'kanban-boards';

function loadFromStorage(): Board[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(b): b is Board =>
				typeof b === 'object' &&
				b !== null &&
				typeof (b as Board).id === 'string' &&
				typeof (b as Board).name === 'string' &&
				Array.isArray((b as Board).lanes)
		);
	} catch {
		return [];
	}
}

export const boards = writable<Board[]>(loadFromStorage());

if (typeof localStorage !== 'undefined') {
	boards.subscribe((value) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	});
}

export const activeBoardId = writable<string | null>(null);

export const activeBoard = derived(
	[boards, activeBoardId],
	([$boards, $activeBoardId]) => {
		if (!$activeBoardId) return null;
		return $boards.find((b) => b.id === $activeBoardId) ?? null;
	}
);

export const laneCounts = derived(activeBoard, ($activeBoard) => {
	if (!$activeBoard) return new Map<string, number>();
	const map = new Map<string, number>();
	for (const lane of $activeBoard.lanes) {
		map.set(lane.id, lane.cards.length);
	}
	return map;
});

export function createBoard(name: string): Board {
	const id = crypto.randomUUID();
	return {
		id,
		name,
		lanes: DEFAULT_LANES.map((l) => ({ ...l, cards: [] }))
	};
}

export function addBoard(board: Board): void {
	boards.update((list) => [...list, board]);
}

export function updateBoard(boardId: string, updater: (board: Board) => Board): void {
	boards.update((list) =>
		list.map((b) => (b.id === boardId ? updater(b) : b))
	);
}

export function deleteBoard(boardId: string): void {
	boards.update((list) => list.filter((b) => b.id !== boardId));
}

export function addCard(boardId: string, laneId: string, title: string, description: string): void {
	const card = {
		id: crypto.randomUUID(),
		title,
		description,
		createdAt: Date.now()
	};
	updateBoard(boardId, (board) => ({
		...board,
		lanes: board.lanes.map((lane) =>
			lane.id === laneId ? { ...lane, cards: [...lane.cards, card] } : lane
		)
	}));
}

export function updateCard(
	boardId: string,
	cardId: string,
	updates: { title?: string; description?: string }
): void {
	updateBoard(boardId, (board) => ({
		...board,
		lanes: board.lanes.map((lane) => ({
			...lane,
			cards: lane.cards.map((c) =>
				c.id === cardId ? { ...c, ...updates } : c
			)
		}))
	}));
}

export function deleteCard(boardId: string, cardId: string): void {
	updateBoard(boardId, (board) => ({
		...board,
		lanes: board.lanes.map((lane) => ({
			...lane,
			cards: lane.cards.filter((c) => c.id !== cardId)
		}))
	}));
}

export function moveCard(
	boardId: string,
	cardId: string,
	fromLaneId: string,
	toLaneId: string
): void {
	if (fromLaneId === toLaneId) return;
	updateBoard(boardId, (board) => {
		let card: import('$lib/types/kanban').Card | null = null;
		const lanes = board.lanes.map((lane) => {
			if (lane.id === fromLaneId) {
				const idx = lane.cards.findIndex((c) => c.id === cardId);
				if (idx >= 0) {
					card = lane.cards[idx];
					return { ...lane, cards: lane.cards.filter((c) => c.id !== cardId) };
				}
			}
			return lane;
		});
		if (!card) return board;
		return {
			...board,
			lanes: lanes.map((lane) =>
				lane.id === toLaneId ? { ...lane, cards: [...lane.cards, card!] } : lane
			)
		};
	});
}
