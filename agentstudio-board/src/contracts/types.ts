// AUTO-SYNCED from agentstudio-core — run sync-context.sh to update
import { ComponentType } from 'react'

export interface AgentComponentProps {
  data: Record<string, unknown>
  onAction: (action: AgentAction) => void
  className?: string
}

export interface AgentComponent {
  name: string
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
