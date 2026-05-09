'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState, LoadingState } from './StateGuards'

type ServiceStatus = 'healthy' | 'degraded' | 'down'

interface Service {
  name: string
  status: ServiceStatus
  latencyP99: number
  errorRate: number
  rps: number
  uptimePct?: number
}

const statusConfig: Record<ServiceStatus, { dot: string; text: string; border: string; order: number }> = {
  down:     { dot: 'bg-red-400',    text: 'text-red-400',    border: 'border-red-900',    order: 0 },
  degraded: { dot: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-900', order: 1 },
  healthy:  { dot: 'bg-green-400',  text: 'text-green-400',  border: 'border-green-900',  order: 2 },
}

function UnhealthyBadge({ services }: { services: Service[] }) {
  const down = services.filter(s => s.status === 'down').length
  const degraded = services.filter(s => s.status === 'degraded').length
  if (down === 0 && degraded === 0) return null
  return (
    <span className="text-xs font-semibold">
      {down > 0 && <span className="text-red-400">{down} down</span>}
      {down > 0 && degraded > 0 && <span className="text-gray-600"> · </span>}
      {degraded > 0 && <span className="text-yellow-400">{degraded} degraded</span>}
    </span>
  )
}

export function ServiceHealth({ data, onAction, className }: AgentComponentProps) {
  const { services } = data as { services: Service[] }
  if (!services) return <LoadingState rows={4} />
  if (services.length === 0) return <EmptyState message="No services to display" />

  const sorted = [...services].sort((a, b) => (statusConfig[a.status]?.order ?? 3) - (statusConfig[b.status]?.order ?? 3))

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-sm font-semibold text-gray-300 shrink-0">Service Health</h3>
          <UnhealthyBadge services={sorted} />
        </div>
        <button
          onClick={() => onAction({
            type: 'escalate',
            label: 'Page On-Call',
            payload: { source: 'service_health', unhealthyServices: sorted.filter(s => s.status !== 'healthy').map(s => s.name) },
            requiresConfirmation: true,
          })}
          className="px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors shrink-0 ml-3"
        >
          &#9889; Page On-Call
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map(s => {
          const cfg = statusConfig[s.status] ?? statusConfig.healthy
          return (
            <div key={s.name} className={`flex items-center gap-2 rounded px-3 py-2 border ${cfg.border} bg-gray-900`}>
              <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
              <span className="text-xs text-gray-300 w-28 shrink-0 truncate">{s.name}</span>
              <span className={`text-xs ${cfg.text} w-14 shrink-0`}>{s.status}</span>
              <span className="text-xs text-gray-500 w-24 shrink-0">p99:{s.latencyP99}ms</span>
              <span className={`text-xs w-16 text-right shrink-0 ${s.errorRate > 1 ? 'text-red-400' : 'text-gray-600'}`}>
                {s.errorRate}%
              </span>
              <span className="text-xs text-gray-700 w-14 text-right shrink-0">{s.rps}rps</span>
              {s.uptimePct != null && (
                <span className={`text-xs w-14 text-right shrink-0 ${s.uptimePct < 99 ? 'text-yellow-500' : 'text-gray-700'}`}>
                  {s.uptimePct}%up
                </span>
              )}
              {s.status !== 'healthy' && (
                <button
                  onClick={() => onAction({ type: 'investigate_service', label: `Investigate ${s.name}`, payload: { service: s.name, status: s.status, latencyP99: s.latencyP99, errorRate: s.errorRate } })}
                  className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors shrink-0 ml-auto"
                >
                  Investigate
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
