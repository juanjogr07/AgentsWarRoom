import { ComponentType } from 'react'

export interface AgentComponentProps {
  data: Record<string, unknown>
  onAction: (action: AgentAction) => void
  className?: string
}

export interface AgentComponent {
  /** Unique key — what the agent uses to select this component */
  name: string
  /** What the agent reads to decide when to render. Be precise and action-oriented. */
  description: string
  component: ComponentType<AgentComponentProps>
  category: 'board' | 'action' | 'compose'
  requiredData?: string[]
}

export interface AgentAction {
  type: string
  label: string
  payload: Record<string, unknown>
  requiresConfirmation?: boolean
}

export interface AgentDecision {
  components: Array<{ name: string; data: Record<string, unknown> }>
  mode: 'board' | 'copilot' | 'compose'
}
