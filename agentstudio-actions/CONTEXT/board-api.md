# M2 (agentstudio-board) API Reference

For use by M3 developers. Source: juanjogr07/agentstudio-board

## Overview

M2 board components emit actions that M1 can use to trigger M3 components.
The flow: IncidentDashboard button click → onAction({ type: 'rollback' }) → M1 agent renders RollbackCard.

## M2 Action Types That May Trigger M3 Components

| M2 Action type | Suggested M3 component | When |
|----------------|------------------------|------|
| `rollback` | `RollbackCard` | User clicks rollback in IncidentDashboard |
| `escalate` | `EscalateCard` | User clicks escalate in IncidentDashboard |

## M2 Data Shapes (for context)

```typescript
// IncidentDashboard data:
{ id, title, severity: 'P1'|'P2'|'P3', startedAt, affectedServices, timeline? }

// ServiceHealth data:
{ services: Array<{ name, status, latencyP99, errorRate, rps }> }

// SprintBoard data:
{ sprintName, daysRemaining, tasks: Array<{ id, title, status, assignee, blocker? }> }

// MetricsChart data:
{ metric, unit, data: Array<{ t, value }>, threshold? }
```

## Mock Data Available

```typescript
import { mockIncident, mockServices, mockSprint, mockLatencyMetric } from '@agentstudio/board/mock-data'
```
