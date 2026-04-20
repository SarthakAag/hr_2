# HR Workflow Designer

A visual HR workflow builder built with **Next.js 15 + React Flow** for the Tredence Studio AI Engineering Internship case study.


## Live Demo

> Run locally using the steps below.

## How to Run

bash
git clone <your-repo-url>
cd hr-workflow
npm install
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

No backend required. All API calls are intercepted by MSW in the browser.

## Features

### Core
- Drag-and-drop workflow canvas powered by React Flow
- 5 custom node types — Start, Task, Approval, Automated Step, End
- Per-node edit forms with live two-way binding to canvas
- Dynamic field arrays (metadata, custom fields, automation params)
- Mock API via MSW service worker (no backend needed)
- Simulation sandbox with step-by-step execution log
- Workflow validation (missing nodes, disconnected edges, cycles)

### Bonus Features
- **Undo / Redo** — full history via Zustand temporal middleware (zundo)
- **Export JSON** — download workflow as `.json` file
- **Import JSON** — restore any saved workflow from file
- **Edge Labels** — double-click any edge to add a label (e.g. Approved / Rejected)
- **Visual Error Indicators** — red outline + badge on broken nodes when simulation runs
- **Keyboard Shortcuts** — `Ctrl+Z` undo, `Ctrl+Y` redo, `Ctrl+S` export
- **Workflow Templates** — one-click load for Onboarding, Leave Approval, Document Verification
- **Auto Layout** — automatically arrange nodes using Dagre graph layout
- **Workflow Status Bar** — live validity check, connected node count, Start/End indicators
- **Dark Mode** — full dark theme toggle with smooth transitions
  
## Folder Structure

<img width="363" height="696" alt="image" src="https://github.com/user-attachments/assets/eadb7b36-ecc5-4eef-9e94-23e4f7a2c620" />


## Key Design Decisions

**Zustand over Context** — Workflow state is mutated on every drag. Zustand's selector-based API avoids unnecessary re-renders compared to a deep context tree.

**MSW over JSON Server** — Runs entirely in the browser as a service worker. Zero backend process, completely transparent to the app code. No ports, no config.

**React Hook Form with useRef for sync** — Each form uses a `useRef` to track previous values and only calls `updateNodeData` when something actually changes. This prevents infinite render loops while keeping the canvas in sync with every keystroke.

**Topological sort for simulation** — `simulateEngine.ts` runs Kahn's algorithm to process nodes in dependency order. Cycles are detected as a side effect. Validation errors are returned before execution begins.

**zundo for Undo/Redo** — Zustand temporal middleware tracks only `nodes` and `edges` in history (not `selectedNodeId`), keeping the history stack lean and focused on meaningful state changes.

**Single BaseNode component** — All 5 node types share a `BaseNode` component with an `error` prop. Adding a 6th node type only requires: a new type in `types/workflow.ts`, a default data entry, a form component, and registration in `nodeTypes.ts`.


## Simulation Engine

The `/api/simulate` mock runs a full graph validation and topological sort:

1. Validates: must have exactly one Start node
2. Validates: must have at least one End node
3. Validates: all nodes must be connected (no islands)
4. Runs Kahn's algorithm for topological ordering
5. Returns step-by-step execution log with status per node


## Tech Stack

| Package | Purpose |
|---|---|
| Next.js 15 | Framework (App Router) |
| React Flow | Canvas engine |
| Zustand | Global state management |
| zundo | Undo/Redo history middleware |
| React Hook Form | Node edit forms |
| MSW | Mock API (browser service worker) |
| Dagre | Auto graph layout algorithm |
| TypeScript | Strict types throughout |


## What's Implemented vs What I'd Add

### Completed
- All 5 node types with custom forms
- Full simulation with topological sort
- Undo/Redo, Export/Import JSON
- Edge labels, error indicators
- Keyboard shortcuts
- Workflow templates
- Auto layout
- Status bar
- Dark mode

### Would Add With More Time
- Cypress E2E tests for full drag + simulate flow
- Toast notifications instead of browser alerts
- Node duplication (right-click context menu)
- Conditional branching (Yes/No edges from Approval nodes)
- Workflow versioning and save history
- Backend persistence with PostgreSQL
- Real authentication with OAuth
- Collaborative editing with WebSockets
