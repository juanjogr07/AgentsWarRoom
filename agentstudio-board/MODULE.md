# M2 — agentstudio-board: Development Guide

You own the **visualization library**. Your job: build React components that show engineering data beautifully. The agent picks which component to render based on the user's question.

## Your Responsibilities

- `IncidentDashboard` — full incident view with severity, timeline, services
- `ServiceHealth` — service health grid with latency, error rates
- `SprintBoard` — sprint progress with blocked tasks
- `MetricsChart` — time-series chart (uses recharts)

## Setup

```bash
git clone https://github.com/juanjogr07/agentstudio-board
cd agentstudio-board
npm install
bash sync-context.sh   # pull latest types from M1
npm run build          # builds dist/ for M1 to consume
```

## Development Flow

```bash
npm run dev   # watch mode — rebuilds on save
```

Tell M1 team to run `npm install` to pick up your changes.

## Component Contract

Every component MUST match this signature:
```typescript
import { AgentComponentProps } from '../contracts/types'

export function YourComponent({ data, onAction, className }: AgentComponentProps) {
  // data is typed as Record<string, unknown> — cast to your specific type
  const typedData = data as YourDataType
  // ...
}
```

## Adding a New Component

1. Create `src/components/YourComponent.tsx`
2. Add to `boardComponents` array in `src/index.ts`
3. Write a precise `description` — this is what the agent reads
4. Add mock data to `src/mock-data.ts`
5. Run `npm run build`

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Main export — `boardComponents` array |
| `src/contracts/types.ts` | Shared interfaces (synced from M1) |
| `src/mock-data.ts` | Demo data for all components |
| `src/components/` | One file per component |
| `sync-context.sh` | Pulls latest types from M1 |
