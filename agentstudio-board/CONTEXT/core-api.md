# M1 (agentstudio-core) API Reference

For use by M2 developers. Source: juanjogr07/agentstudio-core

## ComponentRegistry

```typescript
import { ComponentRegistry } from '../contracts/registry'

const registry = ComponentRegistry.getInstance()
registry.registerAll(boardComponents)  // called by M1 at startup
```

## Your Role as M2

You export `boardComponents: AgentComponent[]` from `src/index.ts`.
M1 calls `registry.registerAll(board.boardComponents)` at startup.
The agent then reads `registry.getDescriptions()` and calls `renderComponents({ components: [...] })`.

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

## Writing Good Descriptions

The `description` field is injected into the AI system prompt. Be specific and action-oriented:

```typescript
// Good:
description: 'Shows real-time health grid for multiple services: latency p99, error rate, status. Use when user asks about system health or degraded services.'

// Bad:
description: 'Service health component'
```
