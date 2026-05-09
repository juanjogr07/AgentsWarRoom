import React, { Component, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { IncidentDashboard } from '../src/components/IncidentDashboard'
import { ServiceHealth } from '../src/components/ServiceHealth'
import { SprintBoard } from '../src/components/SprintBoard'
import { MetricsChart } from '../src/components/MetricsChart'
import { DeployHistory } from '../src/components/DeployHistory'
import { AlertFeed } from '../src/components/AlertFeed'
import { OnCallStatus } from '../src/components/OnCallStatus'
import { LoadingState, EmptyState } from '../src/components/StateGuards'
import {
  mockIncident,
  mockIncidentP2,
  mockIncidentResolved,
  mockServices,
  mockServicesAllHealthy,
  mockSprint,
  mockLatencyMetric,
  mockErrorRateMetric,
  mockDeployHistory,
  mockAlerts,
  mockOnCall,
} from '../src/mock-data'
import type { AgentAction } from '../src/contracts/types'

type Tab = 'demo' | 'all' | 'edge-cases'

function Preview() {
  const [lastAction, setLastAction] = useState<AgentAction | null>(null)
  const [tab, setTab] = useState<Tab>('demo')

  const onAction = (action: AgentAction) => {
    console.log('[action]', action)
    setLastAction(action)
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-white font-mono text-lg font-bold">agentstudio-board — preview</h1>
        <div className="flex gap-1 font-mono text-xs">
          {(['demo', 'all', 'edge-cases'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded transition-colors ${tab === t ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {lastAction && (
        <div className="rounded border border-blue-700 bg-blue-950 px-4 py-2 font-mono text-xs text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 shrink-0">action →</span>
          <span className="break-all flex-1">{JSON.stringify(lastAction)}</span>
          <button onClick={() => setLastAction(null)} className="ml-auto text-blue-700 hover:text-blue-400 shrink-0">&#10005;</button>
        </div>
      )}

      {/* DEMO TAB — mirrors the 90-second hackathon demo flow */}
      {tab === 'demo' && (
        <div className="space-y-6">
          <p className="text-xs text-gray-700 font-mono">Demo flow: incident → health → deploy history → charts → alerts → on-call</p>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Section label='1. "hay un incidente en auth-service" → IncidentDashboard (P1)'>
              <IncidentDashboard data={mockIncident} onAction={onAction} />
            </Section>
            <Section label="2. ServiceHealth — degraded services sorted top">
              <ServiceHealth data={mockServices} onAction={onAction} />
            </Section>
          </div>

          <Section label='3. "qué se deployó?" → DeployHistory (inline rollback confirmation)'>
            <DeployHistory data={mockDeployHistory} onAction={onAction} />
          </Section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Section label="4a. MetricsChart — latency spike (threshold 300ms)">
              <MetricsChart data={mockLatencyMetric} onAction={onAction} />
            </Section>
            <Section label="4b. MetricsChart — error rate spike (threshold 1%)">
              <MetricsChart data={mockErrorRateMetric} onAction={onAction} />
            </Section>
          </div>

          <Section label='5. "qué alertas hay activas?" → AlertFeed'>
            <AlertFeed data={mockAlerts} onAction={onAction} />
          </Section>

          <Section label='6. "quién está de guardia?" → OnCallStatus'>
            <OnCallStatus data={mockOnCall} onAction={onAction} />
          </Section>
        </div>
      )}

      {/* ALL COMPONENTS TAB — every variant */}
      {tab === 'all' && (
        <div className="space-y-6">
          <Section label="IncidentDashboard — P1 investigating">
            <IncidentDashboard data={mockIncident} onAction={onAction} />
          </Section>
          <Section label="IncidentDashboard — P2 identified">
            <IncidentDashboard data={mockIncidentP2} onAction={onAction} />
          </Section>
          <Section label="IncidentDashboard — P2 resolved">
            <IncidentDashboard data={mockIncidentResolved} onAction={onAction} />
          </Section>

          <Section label="ServiceHealth — mixed (degraded sorted first)">
            <ServiceHealth data={mockServices} onAction={onAction} />
          </Section>
          <Section label="ServiceHealth — all healthy">
            <ServiceHealth data={mockServicesAllHealthy} onAction={onAction} />
          </Section>

          <Section label="DeployHistory — with inline rollback confirm">
            <DeployHistory data={mockDeployHistory} onAction={onAction} />
          </Section>

          <Section label="MetricsChart — latency (spike)">
            <MetricsChart data={mockLatencyMetric} onAction={onAction} />
          </Section>
          <Section label="MetricsChart — error rate (spike)">
            <MetricsChart data={mockErrorRateMetric} onAction={onAction} />
          </Section>

          <Section label="SprintBoard — Sprint 14">
            <SprintBoard data={mockSprint} onAction={onAction} />
          </Section>

          <Section label="AlertFeed — 3 firing, 2 resolved">
            <AlertFeed data={mockAlerts} onAction={onAction} />
          </Section>

          <Section label="OnCallStatus — primary + secondary">
            <OnCallStatus data={mockOnCall} onAction={onAction} />
          </Section>
        </div>
      )}

      {/* EDGE CASES TAB — guard states */}
      {tab === 'edge-cases' && (
        <div className="space-y-6">
          <Section label="IncidentDashboard — no data → EmptyState">
            <IncidentDashboard data={{}} onAction={onAction} />
          </Section>
          <Section label="ServiceHealth — empty array → EmptyState">
            <ServiceHealth data={{ services: [] }} onAction={onAction} />
          </Section>
          <Section label="ServiceHealth — undefined → LoadingState">
            <ServiceHealth data={{}} onAction={onAction} />
          </Section>
          <Section label="DeployHistory — empty → EmptyState">
            <DeployHistory data={{ service: 'auth-service', deploys: [] }} onAction={onAction} />
          </Section>
          <Section label="DeployHistory — undefined → LoadingState">
            <DeployHistory data={{ service: 'auth-service' }} onAction={onAction} />
          </Section>
          <Section label="MetricsChart — no points → EmptyState">
            <MetricsChart data={{ metric: 'latency', unit: 'ms', data: [] }} onAction={onAction} />
          </Section>
          <Section label="SprintBoard — empty → EmptyState">
            <SprintBoard data={{ sprintName: 'Sprint 15', daysRemaining: 5, tasks: [] }} onAction={onAction} />
          </Section>
          <Section label="AlertFeed — no alerts → EmptyState">
            <AlertFeed data={{ alerts: [] }} onAction={onAction} />
          </Section>
          <Section label="OnCallStatus — no primary → EmptyState">
            <OnCallStatus data={{ team: 'Platform' }} onAction={onAction} />
          </Section>
          <Section label="LoadingState (standalone)">
            <LoadingState rows={4} />
          </Section>
          <Section label="EmptyState (standalone)">
            <EmptyState message="Nothing to display here" />
          </Section>
        </div>
      )}
    </div>
  )
}

class ErrorBoundary extends Component<{ label: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error)
      return (
        <div className="rounded border border-red-800 bg-red-950 px-4 py-3 font-mono text-xs text-red-400">
          <span className="font-bold">Error in {this.props.label}:</span>{' '}
          {(this.state.error as Error).message}
        </div>
      )
    return this.props.children
  }
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-600 font-mono text-xs mb-2">{label}</p>
      <ErrorBoundary label={label}>{children}</ErrorBoundary>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
