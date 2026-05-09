# M3 (agentstudio-actions) API Reference

For use by M1 and M2 developers. Source: juanjogr07/agentstudio-actions

## Exported Symbol

```typescript
import { actionComponents } from '@agentstudio/actions'
// actionComponents: AgentComponent[]
```

## Components

### RollbackCard
- **Category**: action
- **Required data**: `service`, `currentVersion`, `targetVersion`, `deployedAt` (ISO), `changes` (string[]), `estimatedTime`, `affectedUsers`
- **Actions emitted**: `{ type: 'rollback_confirmed', requiresConfirmation: true }`, `{ type: 'cancel' }`

### EscalateCard
- **Category**: action
- **Required data**: `incidentId`, `severity`, `oncallEngineer` ({ name, handle, pagerdutyId }), `slackChannel`, `affectedUsers`, `businessImpact`
- **Actions emitted**: `{ type: 'escalate_confirmed', requiresConfirmation: true }`, `{ type: 'post_to_slack' }`

### MCPComposer
- **Category**: compose
- **Required data**: `availableTools` (Array<{ name, description, actions }>), `suggestedWorkflow` (Array<{ tool, action, params }>)
- **Actions emitted**: `{ type: 'execute_workflow', requiresConfirmation: true }`

### WorkflowBuilder
- **Category**: compose
- **Required data**: `title`, `steps` (Array<{ id, title, tool, status: 'pending'|'running'|'done'|'error' }>)
- **Actions emitted**: `{ type: 'workflow_complete' }`

## Mock Data

All mock data lives in `src/mock-data.ts` in the agentstudio-actions repo.
Imports: `mockRollback`, `mockEscalate`, `mockMCPComposer`, `mockWorkflow`
