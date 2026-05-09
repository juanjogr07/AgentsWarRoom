# agentstudio-actions — M3: Action Library

> AgentWarRoom · Generative UI Hackathon · May 9, 2026

**M3 exports action and confirmation components** — cards that let the user execute real operations inline. The agent renders these when it decides an action needs to be taken. No forms, no navigation — just generated UI.

## Components

| Name | Category | Description |
|------|----------|-------------|
| `RollbackCard` | action | Deployment rollback confirmation — shows diff, confirm/cancel |
| `EscalateCard` | action | Incident escalation — pagerduty, slack, assign on-call |
| `MCPComposer` | compose | Discovers MCP tools and composes multi-tool workflows |
| `WorkflowBuilder` | compose | Step-by-step automation workflow builder |

## How M1 Uses This

```typescript
// M1 does this at startup:
import('@agentstudio/actions').then(m => registry.registerAll(m.actionComponents))

// Agent decides:
// "User asked to rollback → render RollbackCard"
// "User wants to compose automation → render MCPComposer"
```

## Quick Start

```bash
npm install
npm run build   # produces dist/ for M1 to consume
npm run dev     # storybook or test page
```

## Cross-Module Context

See `CLAUDE.md` for full system context.
See `CONTEXT/core-api.md` for M1 types.
See `CONTEXT/board-api.md` for M2 components you can compose with.
Run `sync-context.sh` to pull latest contracts.
