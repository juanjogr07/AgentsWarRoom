# M3 — agentstudio-actions: Development Guide

You own the **action library**. Your job: build React components that let users execute real operations inline. The agent renders these when it decides action needs to be taken.

## Your Responsibilities

- `RollbackCard` — deployment rollback confirmation with diff and impact
- `EscalateCard` — incident escalation to PagerDuty + Slack + on-call
- `MCPComposer` — discovers MCP tools and composes multi-tool workflows
- `WorkflowBuilder` — step-by-step automation with execution status

## Setup

```bash
git clone https://github.com/juanjogr07/agentstudio-actions
cd agentstudio-actions
npm install
bash sync-context.sh   # pull latest types from M1
npm run build          # builds dist/ for M1 to consume
```

## Development Flow

```bash
npm run dev   # watch mode — rebuilds on save
```

Tell M1 team to run `npm install` to pick up your changes.

## Action Component Pattern

```typescript
import { AgentComponentProps } from '../contracts/types'

export function YourActionCard({ data, onAction }: AgentComponentProps) {
  const typedData = data as YourDataType
  
  return (
    <div>
      {/* show context / impact */}
      <button onClick={() => onAction({
        type: 'confirm',
        label: 'Confirm action',
        payload: { ...typedData },
        requiresConfirmation: true,  // always true for destructive actions
      })}>
        Confirm
      </button>
      <button onClick={() => onAction({ type: 'cancel', label: 'Cancel', payload: {} })}>
        Cancel
      </button>
    </div>
  )
}
```

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Main export — `actionComponents` array |
| `src/contracts/types.ts` | Shared interfaces (synced from M1) |
| `src/mock-data.ts` | Demo data for all components |
| `src/components/` | One file per component |
| `sync-context.sh` | Pulls latest types from M1 |
