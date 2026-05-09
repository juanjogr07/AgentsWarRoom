# M2 (agentstudio-board) API Reference

For use by M1 and M3 developers. Source: juanjogr07/agentstudio-board

## Exported Symbol

```typescript
import { boardComponents } from '@agentstudio/board'
// boardComponents: AgentComponent[]
```

## Components

### IncidentDashboard
- **Category**: board
- **Required data**: `id`, `title`, `severity` ('P1'|'P2'|'P3'), `startedAt` (ISO string), `affectedServices` (string[])
- **Optional data**: `timeline` (Array<{ at: string; event: string }>)
- **Actions emitted**: `{ type: 'rollback', payload: { incidentId } }`, `{ type: 'escalate', payload: { incidentId } }`

### ServiceHealth
- **Category**: board
- **Required data**: `services` (Array<{ name, status: 'healthy'|'degraded'|'down', latencyP99, errorRate, rps }>)
- **Actions emitted**: none

### SprintBoard
- **Category**: board
- **Required data**: `sprintName`, `daysRemaining`, `tasks` (Array<{ id, title, status: 'in_flight'|'blocked'|'done', assignee, blocker? }>)
- **Actions emitted**: none

### MetricsChart
- **Category**: board
- **Required data**: `metric` (string), `unit` (string), `data` (Array<{ t: string; value: number }>)
- **Optional data**: `threshold` (number)
- **Actions emitted**: none

## Mock Data

All mock data lives in `src/mock-data.ts` in the agentstudio-board repo.
Imports: `mockIncident`, `mockServices`, `mockSprint`, `mockLatencyMetric`
