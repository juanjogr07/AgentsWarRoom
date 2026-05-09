# M1 — agentstudio-core: Development Guide

You own the **host application**. Your job: Next.js shell + CopilotKit integration + ComponentRegistry.

## Your Responsibilities

1. **ComponentRegistry** (`src/contracts/registry.ts`) — singleton that holds all components from M2 and M3
2. **CopilotKit integration** — agent reads registry descriptions, calls `renderComponents` action
3. **Dynamic loading** — import M2 and M3 as npm packages at startup
4. **Shell UI** — header, sidebar, component render area

## What You Do NOT Own

- Visualization components → M2 team (agentstudio-board)
- Action components → M3 team (agentstudio-actions)
- You consume their exports, you don't build their UI

## Setup

```bash
# 1. Clone this repo
git clone https://github.com/juanjogr07/agentstudio-core
cd agentstudio-core

# 2. Install deps (includes M2 and M3 from GitHub)
npm install

# 3. Set up env
cp .env.example .env.local
# Edit .env.local — add your ANTHROPIC_API_KEY

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

## Key Files

| File | Purpose |
|------|---------|
| `src/contracts/types.ts` | Source of truth for all shared interfaces |
| `src/contracts/registry.ts` | ComponentRegistry singleton |
| `src/app/page.tsx` | Main page — CopilotKit hooks + registry loading |
| `src/app/api/copilotkit/route.ts` | CopilotKit backend route |
| `src/lib/mock-data.ts` | Demo data fallback |

## Updating Contracts

If you change `src/contracts/types.ts`, notify M2 and M3 teams — they need to run their `sync-context.sh`.

## Connecting to M2/M3

M2 and M3 are npm dependencies in `package.json`:
```json
"@agentstudio/board": "github:juanjogr07/agentstudio-board",
"@agentstudio/actions": "github:juanjogr07/agentstudio-actions"
```

To pick up new M2/M3 commits: `npm install` (re-fetches from GitHub).

## Demo Entry Point

User types: `"hay un incidente en auth-service"` → agent renders IncidentDashboard + ServiceHealth.
See full demo script in CLAUDE.md.
