export interface Card {
	id: string;
	title: string;
	description: string;
	createdAt: number;
}

export interface Lane {
	id: string;
	title: string;
	cards: Card[];
}

export interface Board {
	id: string;
	name: string;
	lanes: Lane[];
}

export const DEFAULT_LANES: Omit<Lane, 'cards'>[] = [
	{ id: 'todo', title: 'Todo' },
	{ id: 'in-progress', title: 'In Progress' },
	{ id: 'done', title: 'Done' }
];
