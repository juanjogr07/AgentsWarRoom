# M3 (agentstudio-actions) API Reference

For use by M2 developers. Source: juanjogr07/agentstudio-actions

## Overview

M3 provides action and confirmation components. Your M2 board components can trigger actions (via `onAction`) that signal M1 to render M3 components.

## When Your Components Emit Actions

When a user clicks an action button in your M2 component, call `onAction`. M1 receives this and can instruct the agent to render an M3 component:

```typescript
// In IncidentDashboard.tsx:
onAction({
  type: 'rollback',           // M1 maps this to RollbackCard
  label: 'Rollback',
  payload: { incidentId },
  requiresConfirmation: true,
})
```

## M3 Components Available

| Component | Triggered by |
|-----------|--------------|
| `RollbackCard` | `onAction({ type: 'rollback' })` from IncidentDashboard |
| `EscalateCard` | `onAction({ type: 'escalate' })` from IncidentDashboard |
| `MCPComposer` | agent decides based on user prompt |
| `WorkflowBuilder` | agent decides based on user prompt |
