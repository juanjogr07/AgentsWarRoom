# agentstudio-board — M2: Visualization Library

> AgentWarRoom · Generative UI Hackathon · May 9, 2026

M2 is the **visualization layer** of the AgentWarRoom system. It exports React components that an AI agent (M1) selects and renders at runtime based on natural language prompts.

```
User says: "hay un incidente en auth-service"
         ↓
M1 agent reads component descriptions
         ↓
Agent picks: IncidentDashboard + ServiceHealth + DeployHistory
         ↓
Components render with live data
```

---

## Quick Start

```bash
npm install
npm run preview     # → http://localhost:5173  (live component preview, no M1 needed)
npm run build       # → dist/ (CJS + ESM + .d.ts, ready for M1)
npm run dev         # → dist/ in watch mode
npm run type-check  # → TypeScript check, no emit
```

---

## Local Preview

The fastest way to develop and debug components **without running M1**.

```bash
npm run preview
# → http://localhost:5173
```

Three tabs:

| Tab | What it shows |
|-----|---------------|
| **demo** | Full 90-second hackathon demo flow in grid layout |
| **all** | Every component variant with real mock data |
| **edge-cases** | All guard states: LoadingState, EmptyState, bad data |

Any component action fires a banner at the top showing the exact `AgentAction` payload — useful for verifying what M3 will receive.

---

## Components

### `IncidentDashboard`

Full incident view for an active P1/P2/P3 incident.

```typescript
data: {
  id: string
  title: string
  severity: 'P1' | 'P2' | 'P3'
  startedAt: string            // ISO timestamp
  affectedServices: string[]
  status?: 'investigating' | 'identified' | 'resolved'
  resolvedAt?: string          // ISO, only if resolved
  timeline?: Array<{ at: string; event: string }>
}
```

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| ↩ Rollback | `rollback` | `{ incidentId }` |
| ⚡ Escalate | `escalate` | `{ incidentId }` |
| ✓ Resolve | `resolve_incident` | `{ incidentId }` |

**Agent trigger words:** incidente, alerta, falla, degradado

---

### `ServiceHealth`

Real-time grid of service statuses sorted by severity (down → degraded → healthy).

```typescript
data: {
  services: Array<{
    name: string
    status: 'healthy' | 'degraded' | 'down'
    latencyP99: number   // ms
    errorRate: number    // %
    rps: number
    uptimePct?: number   // %
  }>
}
```

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| Investigate (per degraded/down row) | `investigate_service` | `{ service, status, latencyP99, errorRate }` |
| ⚡ Page On-Call (header) | `escalate` | `{ source: 'service_health', unhealthyServices }` |

---

### `DeployHistory`

Recent deployment history for a single service with inline rollback confirmation.

```typescript
data: {
  service: string
  deploys: Array<{
    id: string
    service: string
    version: string
    deployedAt: string   // ISO
    deployedBy: string
    status: 'success' | 'rolled_back' | 'in_progress'
    commitSha?: string
    changeCount?: number
  }>
}
```

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| ↩ Rollback to vX.X.X → Confirm Rollback | `rollback` | `{ deployId, service, version }` |

Rollback uses a two-step inline confirmation: click → confirm banner appears → click confirm → fires action. No M3 card needed.

**Agent trigger words:** deploy, deployó, rollback, qué cambió, recent changes

---

### `AlertFeed`

Live feed of firing and resolved alerts across all services.

```typescript
data: {
  alerts: Array<{
    id: string
    service: string
    message: string
    severity: 'critical' | 'warning' | 'info'
    firedAt: string    // ISO
    resolved: boolean
  }>
  title?: string       // defaults to "Alert Feed"
}
```

Active critical alert dots pulse (`animate-pulse`) as a live urgency signal. Resolved alerts appear faded (opacity-50).

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| + Open Incident | `create_incident` | `{ alertIds, services }` |
| ⚡ Page On-Call | `escalate` | `{ alertCount, services }` |

Buttons only appear when there are active (unresolved) alerts.

**Agent trigger words:** alertas, qué está fallando, qué está disparado, firing

---

### `MetricsChart`

Time-series line chart for a single engineering metric with optional threshold line.

```typescript
data: {
  metric: string                        // chart title
  unit: string                          // "ms", "%", "rps", "MB"
  data: Array<{ t: string; value: number }>  // t = display label (e.g. "14:32:00")
  threshold?: number                    // triggers red line + Create Incident button
}
```

When `max(values) > threshold`, the line turns red and a "Create Incident" button appears.

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| + Create Incident | `create_incident` | `{ metric, value: max, threshold }` |

---

### `SprintBoard`

Sprint task board showing in-flight, blocked, and done tasks.

```typescript
data: {
  sprintName: string
  daysRemaining: number   // ≤ 0 shows "OVERDUE" in red
  tasks: Array<{
    id: string
    title: string
    status: 'in_flight' | 'blocked' | 'done'
    assignee: string
    blocker?: string      // shown below blocked task row
  }>
}
```

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| Unblock (per blocked task) | `unblock_task` | `{ taskId, blocker }` |

**Agent trigger words:** sprint, blocked, bloqueado, team capacity

---

### `OnCallStatus`

Current on-call roster with primary and optional secondary contacts.

```typescript
data: {
  team: string
  primary: {
    name: string
    handle: string
    phone?: string
    schedule: string
    since: string    // ISO
    until: string    // ISO — displayed as "until Fri 08:00"
  }
  secondary?: { ...same shape... }
  escalationPolicy?: string   // e.g. "PagerDuty · 5min escalation"
}
```

**Actions fired:**

| Button | `type` | Payload |
|--------|--------|---------|
| 📞 Page (per person) | `page_oncall` | `{ handle, tier: 'primary'|'secondary', team }` |
| ⚡ Escalate to On-Call | `escalate` | `{ team, primaryHandle }` |

**Agent trigger words:** quién está de guardia, on-call, escalar, pagear

---

## Guard States

Every component handles missing/empty data without crashing:

```typescript
// data.services undefined → pulsing shimmer skeleton
<ServiceHealth data={{}} onAction={...} />

// data.services = [] → empty state message
<ServiceHealth data={{ services: [] }} onAction={...} />
```

`LoadingState` and `EmptyState` are also exported for direct use:

```typescript
import { LoadingState, EmptyState } from '@agentstudio/board'

<LoadingState rows={4} />
<EmptyState message="No services to display" />
```

---

## Adding a New Component

**1. Create `src/components/MyComponent.tsx`:**

```typescript
'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState, LoadingState } from './StateGuards'

export function MyComponent({ data, onAction, className }: AgentComponentProps) {
  const { field } = data as { field: string }
  if (!field) return <LoadingState rows={3} />

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      {/* content */}
      <button
        onClick={() => onAction({ type: 'MY_ACTION', label: 'Do thing', payload: { field } })}
        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
      >
        Do thing
      </button>
    </div>
  )
}
```

**2. Register in `src/index.ts`:**

```typescript
import { MyComponent } from './components/MyComponent'

// add to boardComponents array:
{
  name: 'MyComponent',
  description: 'One precise sentence. When to use it. Trigger words in Spanish and English. What actions it fires.',
  component: MyComponent as ComponentType<AgentComponentProps>,
  category: 'board',
  requiredData: ['field'],
}
```

**3. Add mock data to `src/mock-data.ts`:**

```typescript
export const mockMyComponent = { field: 'value' }
```

**4. Add to `preview/main.tsx`** under the "all" tab.

**5. Rebuild:** `npm run build`

The component is immediately available to M1 — no M1 changes needed.

---

## Action Types Reference

All `onAction` calls fire an `AgentAction`. M3 listens for these to show confirmation cards or execute side-effects.

```typescript
interface AgentAction {
  type: string
  label: string
  payload: Record<string, unknown>
  requiresConfirmation?: boolean   // if true, M3 shows a confirm card first
}
```

| `type` | Source component(s) | M3 handler |
|--------|---------------------|-----------|
| `rollback` | DeployHistory, IncidentDashboard | RollbackCard |
| `escalate` | ServiceHealth, AlertFeed, IncidentDashboard, OnCallStatus | EscalateCard |
| `create_incident` | AlertFeed, MetricsChart | — |
| `resolve_incident` | IncidentDashboard | — |
| `investigate_service` | ServiceHealth | — |
| `unblock_task` | SprintBoard | — |
| `page_oncall` | OnCallStatus | EscalateCard |

---

## M1 Integration

```bash
# In M1 (agentstudio-core):
npm install @agentstudio/board

# Or local development link:
# package.json → "@agentstudio/board": "file:../agentstudio-board"
npm install
```

M1 registers components at startup:

```typescript
import { boardComponents } from '@agentstudio/board'
registry.registerAll(boardComponents)
// → agent can now select any M2 component by name
```

The agent reads `registry.getDescriptions()` — a concatenation of all `description` fields — to decide which component to render. **The description is the API the agent reads.** Write it precisely.

---

## Visual Design System

All components share the same dark design system:

| Token | Value | Usage |
|-------|-------|-------|
| Card bg | `bg-gray-950` | All card containers |
| Card border | `border-gray-800` | Default border |
| Card ring | `ring-1 ring-white/5` | Glass-like inner highlight |
| Row bg | `bg-gray-900` | List rows inside cards |
| Critical | `red-400/700/900/950` | Down services, P1, critical alerts |
| Warning | `yellow-400/700/950` | Degraded, P2, warning alerts |
| Healthy | `green-400/800/950` | Healthy, resolved, done |
| Info | `blue-400/700/950` | In-flight tasks, info alerts |
| Body text | `text-gray-300` | Primary content |
| Label text | `text-gray-500` | Section labels |
| Muted text | `text-gray-600 / text-gray-700` | Secondary/tertiary data |
| Font | `font-mono` | All components |

---

## File Structure

```
src/
  components/
    IncidentDashboard.tsx   # P1/P2/P3 incident view
    ServiceHealth.tsx       # Service status grid
    DeployHistory.tsx       # Deploy history + rollback
    AlertFeed.tsx           # Live alert feed
    MetricsChart.tsx        # Time-series chart (recharts)
    SprintBoard.tsx         # Sprint task board
    OnCallStatus.tsx        # On-call roster
    StateGuards.tsx         # LoadingState + EmptyState
  contracts/
    types.ts                # AgentComponentProps, AgentAction (auto-synced from M1)
  mock-data.ts              # Offline demo data for all components
  index.ts                  # Registry + exports
  utils.ts                  # shared elapsed() time formatter

preview/
  index.html                # Vite entry (Tailwind CDN)
  main.tsx                  # 3-tab preview harness

dist/                       # Build output (gitignored)
  index.js                  # CJS
  index.mjs                 # ESM
  index.d.ts                # Types

CLAUDE.md                   # AI coding context
CONTEXT/
  core-api.md               # M1 API reference
  actions-api.md            # M3 action components reference
sync-context.sh             # Pull latest contracts from M1
```

---

## Cross-Module Reference

| Module | Repo | Role |
|--------|------|------|
| M1 — agentstudio-core | juanjogr07/agentstudio-core | Next.js host, CopilotKit, ComponentRegistry |
| **M2 — agentstudio-board** | juanjogr07/agentstudio-board | **Visualization components (here)** |
| M3 — agentstudio-actions | juanjogr07/agentstudio-actions | Action/confirmation components |

Run `bash sync-context.sh` after M1 changes its types.
