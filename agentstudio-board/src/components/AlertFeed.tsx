'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState, LoadingState } from './StateGuards'
import { elapsed } from '../utils'

type AlertSeverity = 'critical' | 'warning' | 'info'

interface Alert {
  id: string
  service: string
  message: string
  severity: AlertSeverity
  firedAt: string
  resolved: boolean
}

interface AlertFeedData {
  alerts: Alert[]
  title?: string
}

const severityConfig: Record<AlertSeverity, { dot: string; text: string; border: string; bg: string }> = {
  critical: { dot: 'bg-red-400',    text: 'text-red-400',    border: 'border-red-900',    bg: 'bg-red-950'    },
  warning:  { dot: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-900', bg: 'bg-yellow-950' },
  info:     { dot: 'bg-blue-400',   text: 'text-blue-400',   border: 'border-blue-900',   bg: 'bg-blue-950'   },
}

export function AlertFeed({ data, onAction, className }: AgentComponentProps) {
  const { alerts, title } = data as unknown as AlertFeedData
  if (!alerts) return <LoadingState rows={4} />
  if (alerts.length === 0) return <EmptyState message="No alerts" />

  const active = alerts.filter(a => !a.resolved)
  const resolved = alerts.filter(a => a.resolved)
  const activeServices = Array.from(new Set(active.map(a => a.service)))

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">{title ?? 'Alert Feed'}</h3>
        <div className="flex gap-3 text-xs">
          {active.length > 0 && <span className="text-red-400 font-semibold">{active.length} firing</span>}
          {resolved.length > 0 && <span className="text-gray-600">{resolved.length} resolved</span>}
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map(a => {
          const cfg = severityConfig[a.severity] ?? severityConfig.info
          const isActiveCritical = !a.resolved && a.severity === 'critical'
          return (
            <div
              key={a.id}
              className={`flex items-start gap-3 rounded px-3 py-2 border ${
                a.resolved ? 'border-gray-800 bg-gray-900 opacity-50' : `${cfg.border} ${cfg.bg}`
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0 mt-1 ${isActiveCritical ? 'animate-pulse' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold ${cfg.text}`}>{a.severity.toUpperCase()}</span>
                  <span className="text-xs text-gray-400 bg-gray-800 px-1.5 rounded">{a.service}</span>
                  {a.resolved && <span className="text-xs text-green-700 bg-gray-800 px-1.5 rounded">&#10003; resolved</span>}
                </div>
                <p className="text-xs text-gray-300 mt-0.5 break-words">{a.message}</p>
              </div>
              <span className="text-xs text-gray-600 shrink-0 mt-0.5">{elapsed(a.firedAt)}</span>
            </div>
          )
        })}
      </div>

      {active.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-800 flex gap-2">
          <button
            onClick={() => onAction({
              type: 'create_incident',
              label: 'Open Incident',
              payload: { alertIds: active.map(a => a.id), services: activeServices },
              requiresConfirmation: true,
            })}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors"
          >
            + Open Incident
          </button>
          <button
            onClick={() => onAction({
              type: 'escalate',
              label: 'Page On-Call',
              payload: { alertCount: active.length, services: activeServices },
              requiresConfirmation: true,
            })}
            className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors"
          >
            &#9889; Page On-Call
          </button>
        </div>
      )}
    </div>
  )
}
