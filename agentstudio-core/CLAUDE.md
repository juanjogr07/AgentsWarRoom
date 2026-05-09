# AgentWarRoom — AI Context (All Modules)

## Project: AgentWarRoom
Generative UI Hackathon · AI Tinkerers · May 9, 2026

A Next.js application where an AI agent generates interactive UI at runtime for engineering incident management. This is NOT a chatbot — the agent responds to questions by rendering React components, not text.

## The 3 Modules

| Module | Repo | Role |
|--------|------|------|
| M1 — agentstudio-core | juanjogr07/agentstudio-core | Host app, CopilotKit, ComponentRegistry |
| M2 — agentstudio-board | juanjogr07/agentstudio-board | Visualization React components |
| M3 — agentstudio-actions | juanjogr07/agentstudio-actions | Action/confirmation React components |

## How They Connect

```
M1 (Next.js host)
  ├── ComponentRegistry (singleton)
  │     ├── registered by: M2.boardComponents (loaded at startup)
  │     └── registered by: M3.actionComponents (loaded at startup)
  └── CopilotKit agent
        ├── reads: registry.getDescriptions() → injected into system prompt
        └── calls: renderComponents({ components: [...] }) → UI appears
```

Key insight:
- M2 and M3 export arrays of `AgentComponent` objects
- M1 loads them as npm packages at startup
- The agent NEVER imports components directly — it picks names from descriptions
- Adding a new component to M2 or M3 makes it available to the agent automatically

## Shared TypeScript Contracts

Source of truth: `src/contracts/types.ts` in M1. M2 and M3 copy via `sync-context.sh`.

```typescript
export interface AgentComponentProps {
  data: Record<string, unknown>
  onAction: (action: AgentAction) => void
  className?: string
}

export interface AgentComponent {
  name: string           // unique key the agent uses to select
  description: string    // what agent reads to decide when to render
  component: ComponentType<AgentComponentProps>
  category: 'board' | 'action' | 'compose'
  requiredData?: string[]
}

export interface AgentAction {
  type: string
  label: string
  payload: Record<string, unknown>
  requiresConfirmation?: boolean
}

export interface AgentDecision {
  components: Array<{ name: string; data: Record<string, unknown> }>
  mode: 'board' | 'copilot' | 'compose'
}
```

## Available Components

### M2 — Board (agentstudio-board)
| Component | When agent uses it |
|-----------|-------------------|
| `IncidentDashboard` | User reports or asks about an active incident |
| `ServiceHealth` | User asks about system health, latency, error rates |
| `SprintBoard` | User asks about sprint status, blocked work |
| `MetricsChart` | User wants to visualize a trend or spike |

### M3 — Actions (agentstudio-actions)
| Component | When agent uses it |
|-----------|-------------------|
| `RollbackCard` | User wants to rollback a deployment |
| `EscalateCard` | User needs to escalate an incident or page someone |
| `MCPComposer` | User wants to compose a multi-tool automation |
| `WorkflowBuilder` | User wants a step-by-step plan to execute |

## Demo Script — WarRoom (90 seconds)

1. `"hay un incidente en auth-service, muéstrame qué está pasando"`
   → Agent renders: `IncidentDashboard` (P1, 8 min) + `ServiceHealth` (auth: 2.1% error)
2. Click "↩ Rollback" button → Agent renders: `RollbackCard` (v2.5.0 → v2.4.1)
3. Confirm rollback → Agent renders: `WorkflowBuilder` (5 steps)
4. `"arma un workflow para escalar y notificar al equipo"`
   → Agent renders: `MCPComposer` (Slack + PagerDuty + GitHub)

## Tech Stack
- M1: Next.js 15 App Router, CopilotKit 1.3, Anthropic claude-sonnet-4-6, Tailwind CSS
- M2/M3: React + TypeScript library (built with tsup), recharts (M2 only)
- Integration: M2 and M3 installed in M1 via GitHub package URLs

## Environment Variables (M1 only)
```
ANTHROPIC_API_KEY=your_key_here
```

## If You're Working on M1
- ComponentRegistry is `src/contracts/registry.ts` — singleton pattern
- Agent system prompt auto-includes `registry.getDescriptions()`
- `useCopilotAction('renderComponents')` is the only CopilotKit action needed
- Load M2/M3 lazily with dynamic import at startup — never import their components directly

## If You're Working on M2
1. Run `bash sync-context.sh` to get latest types from M1
2. Components must accept `AgentComponentProps` (data + onAction + className)
3. Export array as `boardComponents: AgentComponent[]` from `src/index.ts`
4. `description` field = what the agent reads to decide. Make it precise.
5. All demo data lives in `src/mock-data.ts` — the demo runs fully offline

## If You're Working on M3
1. Run `bash sync-context.sh` to get latest types
2. Action components call `onAction(...)` when user confirms or cancels
3. Export array as `actionComponents: AgentComponent[]` from `src/index.ts`
4. Use `requiresConfirmation: true` for destructive actions (rollback, escalate)
5. All demo data lives in `src/mock-data.ts`
