# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AgentWarRoom — M2: agentstudio-board

Visualization library for the AgentWarRoom hackathon. Exports React components that an AI agent selects and renders at runtime.

## Commands

```bash
npm run build        # tsup → dist/ (CJS + ESM + .d.ts)
npm run dev          # tsup --watch (rebuild on save)
npm run type-check   # tsc --noEmit (no emit, type errors only)
bash sync-context.sh # pull latest types from M1 (agentstudio-core)
```

No test suite. No lint script. Build output: `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`.

## Architecture

3-module system where M1 (Next.js host) dynamically renders components selected by an AI agent:

```
M1 (Next.js host)
  ├── ComponentRegistry (singleton)
  │     ├── registered by: M2.boardComponents (loaded at startup)
  │     └── registered by: M3.actionComponents (loaded at startup)
  └── CopilotKit agent
        ├── reads: registry.getDescriptions() → injected into system prompt
        └── calls: renderComponents({ components: [...] }) → UI appears
```

**Key insight:** The agent NEVER imports components directly — it picks names from `description` strings. The `description` field is what the agent reads to decide when to use a component. Make it precise and action-oriented.

### Module roles

| Module | Repo | Role |
|--------|------|------|
| M1 — agentstudio-core | juanjogr07/agentstudio-core | Host app, CopilotKit, ComponentRegistry |
| M2 — agentstudio-board | juanjogr07/agentstudio-board | Visualization React components (YOU ARE HERE) |
| M3 — agentstudio-actions | juanjogr07/agentstudio-actions | Action/confirmation React components |

## Component Pattern

All components follow this pattern:

```typescript
'use client'  // required — M1 is Next.js App Router

import type { AgentComponentProps } from '../contracts/types'

export function MyComponent({ data, onAction, className }: AgentComponentProps) {
  // cast data fields: const title = data.title as string
  // fire actions: onAction({ type: 'ACTION_TYPE', label: 'Label', payload: {}, requiresConfirmation: true })
}
```

`src/contracts/types.ts` is **auto-synced from M1** — never edit it manually. Run `bash sync-context.sh` to update.

## Registering a New Component

In `src/index.ts`, add to the `boardComponents` array:

```typescript
{
  name: 'MyComponent',          // unique key agent uses to select it
  description: '...',           // what agent reads — be precise about WHEN to use
  component: MyComponent,
  category: 'board',
  requiredData: ['field1', 'field2'],
}
```

Adding it here makes it available to the agent automatically — no M1 changes needed.

## Shared TypeScript Contracts

```typescript
interface AgentComponentProps {
  data: Record<string, unknown>
  onAction: (action: AgentAction) => void
  className?: string
}

interface AgentComponent {
  name: string
  description: string
  component: ComponentType<AgentComponentProps>
  category: 'board' | 'action' | 'compose'
  requiredData?: string[]
}

interface AgentAction {
  type: string
  label: string
  payload: Record<string, unknown>
  requiresConfirmation?: boolean
}
```

## Mock Data

`src/mock-data.ts` has 4 objects for offline demo: `mockIncident`, `mockServices`, `mockSprint`, `mockLatencyMetric`. Use these when writing or testing components — the demo runs fully offline.

## Available Components (M2)

| Component | When agent uses it |
|-----------|-------------------|
| `IncidentDashboard` | User reports or asks about an active incident |
| `ServiceHealth` | User asks about system health, latency, error rates |
| `SprintBoard` | User asks about sprint status, blocked work |
| `MetricsChart` | User wants to visualize a trend or spike |

## Available Components (M3 — for cross-module reference)

| Component | When agent uses it |
|-----------|-------------------|
| `RollbackCard` | Rollback a deployment |
| `EscalateCard` | Escalate an incident or page someone |
| `MCPComposer` | Compose a multi-tool automation |
| `WorkflowBuilder` | Step-by-step plan to execute |

## Tech Stack

- React + TypeScript library built with tsup
- `recharts` for charts (only runtime dependency)
- React 18/19 as peerDependency (not bundled)
- `'use client'` on all components (consumed by Next.js App Router)

## CONTEXT/ Files

- `CONTEXT/core-api.md` — M1 API reference (registry, hooks)
- `CONTEXT/actions-api.md` — M3 action components you can trigger from M2 components
