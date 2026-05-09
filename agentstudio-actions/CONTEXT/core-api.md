# M1 (agentstudio-core) API Reference

For use by M3 developers. Source: juanjogr07/agentstudio-core

## Your Role as M3

You export `actionComponents: AgentComponent[]` from `src/index.ts`.
M1 calls `registry.registerAll(actions.actionComponents)` at startup.
The agent reads descriptions and calls `renderComponents({ components: [...] })`.

## AgentComponent Interface

```typescript
interface AgentComponent {
  name: string           // unique — agent uses this to select
  description: string    // agent reads this to decide WHEN to render
  component: ComponentType<AgentComponentProps>
  category: 'board' | 'action' | 'compose'
  requiredData?: string[]
}
```

## AgentComponentProps Interface

```typescript
interface AgentComponentProps {
  data: Record<string, unknown>  // cast to your specific data type
  onAction: (action: AgentAction) => void
  className?: string
}
```

## AgentAction Interface

```typescript
interface AgentAction {
  type: string
  label: string
  payload: Record<string, unknown>
  requiresConfirmation?: boolean  // true for destructive actions
}
```

## Action Component Best Practices

1. Always provide Confirm + Cancel buttons for destructive actions
2. Set `requiresConfirmation: true` for rollback, escalate, deploy
3. Show impact metrics (affected users, estimated time) before confirmation
4. Call `onAction({ type: 'cancel' })` when user cancels
