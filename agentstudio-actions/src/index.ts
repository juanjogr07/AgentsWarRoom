import { ComponentType } from 'react'
import type { AgentComponent, AgentComponentProps } from './contracts/types'
import { RollbackCard } from './components/RollbackCard'
import { EscalateCard } from './components/EscalateCard'
import { MCPComposer } from './components/MCPComposer'
import { WorkflowBuilder } from './components/WorkflowBuilder'

export const actionComponents: AgentComponent[] = [
  {
    name: 'RollbackCard',
    description: 'Deployment rollback confirmation card — shows current version, target version, affected services, and confirm/cancel buttons with impact summary. Use when user wants to rollback a deployment or revert a change that caused an incident.',
    component: RollbackCard as ComponentType<AgentComponentProps>,
    category: 'action',
    requiredData: ['service', 'currentVersion', 'targetVersion', 'deployedAt'],
  },
  {
    name: 'EscalateCard',
    description: 'Incident escalation card — shows on-call engineer, PagerDuty link, Slack channel, and escalation button with business impact. Use when user needs to escalate an incident, page someone, or notify the team.',
    component: EscalateCard as ComponentType<AgentComponentProps>,
    category: 'action',
    requiredData: ['incidentId', 'severity', 'oncallEngineer'],
  },
  {
    name: 'MCPComposer',
    description: 'Discovers available MCP tools and lets user compose a multi-step workflow combining multiple tools (Slack, PagerDuty, GitHub, Jira). Use when user wants to automate a multi-service action or build a workflow.',
    component: MCPComposer as ComponentType<AgentComponentProps>,
    category: 'compose',
    requiredData: ['availableTools', 'suggestedWorkflow'],
  },
  {
    name: 'WorkflowBuilder',
    description: 'Step-by-step automation workflow builder with execution status per step. Use when user wants to see an ordered plan they can execute or confirm, or after a rollback to show next steps.',
    component: WorkflowBuilder as ComponentType<AgentComponentProps>,
    category: 'compose',
    requiredData: ['title', 'steps'],
  },
]

export { mockRollback, mockEscalate, mockMCPComposer, mockWorkflow } from './mock-data'
export type { AgentComponent, AgentComponentProps }
