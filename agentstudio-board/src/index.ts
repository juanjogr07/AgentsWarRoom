import { ComponentType } from 'react'
import type { AgentComponent, AgentComponentProps } from './contracts/types'
import { IncidentDashboard } from './components/IncidentDashboard'
import { ServiceHealth } from './components/ServiceHealth'
import { SprintBoard } from './components/SprintBoard'
import { MetricsChart } from './components/MetricsChart'
import { DeployHistory } from './components/DeployHistory'
import { AlertFeed } from './components/AlertFeed'
import { OnCallStatus } from './components/OnCallStatus'

export const boardComponents: AgentComponent[] = [
  {
    name: 'IncidentDashboard',
    description: 'Shows active incident: severity (P1/P2/P3), status (investigating/identified/resolved), elapsed time, affected services, and event timeline. Trigger words: incidente, alerta, falla, degradado. Pair with ServiceHealth and DeployHistory. Has Rollback, Escalate, and Resolve action buttons.',
    component: IncidentDashboard as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['id', 'title', 'severity', 'startedAt', 'affectedServices'],
  },
  {
    name: 'ServiceHealth',
    description: 'Real-time health grid for all services: latency p99 (ms), error rate (%), requests/sec, uptime %, and status (healthy/degraded/down). Degraded services sort to top. Use when user asks about system health or performance. Each degraded service has an Investigate button. Header has Page On-Call button.',
    component: ServiceHealth as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['services'],
  },
  {
    name: 'SprintBoard',
    description: 'Sprint task board: in-flight, blocked (with blockers), done, days remaining. Use when user asks about sprint status, blocked work, or team capacity — trigger words: sprint, blocked, bloqueado. Each blocked task has an Unblock button.',
    component: SprintBoard as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['sprintName', 'tasks', 'daysRemaining'],
  },
  {
    name: 'MetricsChart',
    description: 'Time-series line chart for a single engineering metric (latency ms, error rate %, RPS, memory MB) with optional threshold line. Use when user wants to see a trend, spike, or degradation over time. Shows Create Incident button when threshold exceeded.',
    component: MetricsChart as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['metric', 'data', 'unit'],
  },
  {
    name: 'DeployHistory',
    description: 'Recent deployment history for a service: version, deploy time, deployer, commit SHA, change count, and outcome (success/in_progress/rolled_back). Use when user asks what changed before an incident, wants to rollback, or asks about recent deploys — trigger words: deploy, deployó, rollback, qué cambió. Each deploy row has an inline-confirmed Rollback button.',
    component: DeployHistory as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['service', 'deploys'],
  },
  {
    name: 'AlertFeed',
    description: 'Real-time alert feed: shows firing and resolved alerts with severity (critical/warning/info), service name, message, and elapsed time. Use when user asks about active alerts, what is firing right now, or to see all ongoing issues — trigger words: alertas, qué está fallando, qué está disparado. Has Open Incident and Page On-Call action buttons when alerts are firing.',
    component: AlertFeed as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['alerts'],
  },
  {
    name: 'OnCallStatus',
    description: 'Shows who is currently on call: primary and secondary contact, schedule, shift end time, and phone. Use when user asks who is on call, needs to page someone, or before escalating an incident — trigger words: quién está de guardia, on-call, escalar, pagear. Has individual Page buttons and an Escalate button.',
    component: OnCallStatus as ComponentType<AgentComponentProps>,
    category: 'board',
    requiredData: ['team', 'primary'],
  },
]

export type { AgentComponent, AgentComponentProps, AgentAction, AgentDecision } from './contracts/types'
export { EmptyState, LoadingState } from './components/StateGuards'
