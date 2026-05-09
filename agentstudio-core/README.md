# agentstudio-core — M1: Host Application

> AgentWarRoom · Generative UI Hackathon · May 9, 2026

**M1 is the host app.** It runs the Next.js shell, owns the CopilotKit integration, and loads M2 (board) and M3 (actions) as npm packages at runtime. The agent reads component descriptions from the registry and decides which UI to render — no pre-built pages.

## Architecture

```
User prompt
   │
   ▼
CopilotKit (Claude claude-sonnet-4-6)
   │  reads: ComponentRegistry.getDescriptions()
   ▼
renderComponents({ components: [...] })
   │
   ▼
ComponentRegistry.get(name) → React component → rendered in UI
```

## Modules

| Module | Repo | Role |
|--------|------|------|
| **M1 — core** | this repo | Host app, CopilotKit, registry |
| **M2 — board** | agentstudio-board | Visualization components |
| **M3 — actions** | agentstudio-actions | Action/confirmation cards |

## Quick Start

```bash
npm install
cp .env.example .env.local
# add ANTHROPIC_API_KEY to .env.local
npm run dev
# open http://localhost:3000
```

## Demo Script (WarRoom — 90 seconds)

1. Type: `"hay un incidente en auth-service, muéstrame qué está pasando"`
2. Agent renders: `IncidentDashboard` + `ServiceHealth` (M2 components)
3. Click "¿Qué hago?" → Agent renders: `RollbackCard` (M3 component)
4. Confirm rollback → Agent renders: `WorkflowBuilder` with steps
5. Ask: `"arma un workflow para escalar y notificar"` → `MCPComposer` appears

## Stack

- Next.js 15 (App Router)
- CopilotKit + Anthropic claude-sonnet-4-6
- Tailwind CSS
- TypeScript

## Cross-Module Context

See `CLAUDE.md` for full system context shared across all 3 repos.
See `CONTEXT/` for API references from M2 and M3.
Run `sync-context.sh` to pull latest contracts from all modules.
