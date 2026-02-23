You are helping me build a production-quality Kanban board app using SvelteKit + Tailwind CSS.

Context:

- I am a senior React developer learning Svelte.
- I want to deeply understand Svelte reactivity, stores, routing, and derived state.
- Avoid React-style mental models (no useEffect thinking).
- Use idiomatic Svelte patterns.
- Keep architecture scalable and clean.

Tech Stack:

- Latest SvelteKit
- TypeScript enabled
- Tailwind CSS configured
- No component libraries
- No external state libraries
- Use Svelte stores (writable + derived)

Project Goal:
Build a Kanban board with:

Routes:

- / (Board list page)
- /boards/[id] (Board detail page)

Features:

- Multiple boards
- 3 default lanes per board (Todo, In Progress, Done)
- Add / Edit / Delete cards
- Move cards between lanes
- Derived card counts per lane
- Persist state to localStorage
- Clean UI with Tailwind
- Responsive layout

Architecture Rules:

- Use src/lib/stores for global state
- Keep domain types in src/lib/types
- Keep reusable components in src/lib/components
- Avoid large monolithic components
- Use derived stores when appropriate
- Use reactive declarations ($:) instead of imperative syncing
- Avoid unnecessary prop drilling when stores are better

Folder Structure Target:
src/
routes/
+layout.svelte
+page.svelte
boards/
[id]/
+page.svelte
lib/
components/
BoardCard.svelte
Lane.svelte
KanbanCard.svelte
CardModal.svelte
stores/
boards.ts
types/
kanban.ts

Data Model:

Board:
id: string
name: string
lanes: Lane[]

Lane:
id: string
title: string
cards: Card[]

Card:
id: string
title: string
description: string
createdAt: number

Store Requirements:

- writable boards store
- writable activeBoardId store
- derived activeBoard store
- derived laneCounts store
- localStorage persistence
- rehydrate on load

Tailwind Guidelines:

- Use clean spacing (gap-4, p-4)
- Use rounded-xl cards
- Subtle shadows
- Flex-based lane layout
- Make lanes horizontally scrollable
- Make it visually modern but minimal

Implementation Strategy:

1. Scaffold types
2. Build stores with persistence
3. Implement board list page
4. Implement board detail page
5. Build Lane component
6. Build KanbanCard component
7. Implement add/edit modal
8. Implement movement between lanes
9. Add derived lane counts
10. Refactor for clarity

Important:

- Do not generate the entire project at once.
- Work step-by-step.
- After each major step, pause and wait for confirmation.
- Briefly explain architectural decisions.
- Explicitly point out where Svelte differs from React patterns.
- Prefer clarity over cleverness.

Start by scaffolding the types and store implementation with persistence.
