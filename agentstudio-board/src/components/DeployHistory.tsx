'use client'
import { useState } from 'react'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState, LoadingState } from './StateGuards'
import { elapsed } from '../utils'

type DeployStatus = 'success' | 'rolled_back' | 'in_progress'

interface Deploy {
  id: string
  service: string
  version: string
  deployedAt: string
  deployedBy: string
  status: DeployStatus
  commitSha?: string
  changeCount?: number
}

interface DeployHistoryData {
  service: string
  deploys: Deploy[]
}

const statusConfig: Record<DeployStatus, { dot: string; text: string }> = {
  success:     { dot: 'bg-green-400',  text: 'text-green-400'  },
  rolled_back: { dot: 'bg-red-400',    text: 'text-red-400'    },
  in_progress: { dot: 'bg-yellow-400', text: 'text-yellow-400' },
}

export function DeployHistory({ data, onAction, className }: AgentComponentProps) {
  const { service, deploys } = data as unknown as DeployHistoryData
  const [pendingRollback, setPendingRollback] = useState<Deploy | null>(null)

  if (!deploys) return <LoadingState rows={3} />
  if (deploys.length === 0) return <EmptyState message={`No deploys found for ${service ?? 'service'}`} />

  function confirmRollback(deploy: Deploy) {
    onAction({
      type: 'rollback',
      label: `Rollback to ${deploy.version}`,
      payload: { deployId: deploy.id, service: deploy.service, version: deploy.version },
      requiresConfirmation: false,
    })
    setPendingRollback(null)
  }

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Deploy History — {service}</h3>

      {pendingRollback && (
        <div className="mb-4 rounded border border-red-700 bg-red-950 px-4 py-3">
          <p className="text-xs text-red-300 font-semibold mb-1">&#9888; Confirm rollback</p>
          <p className="text-xs text-red-400 mb-3">
            Roll back <span className="font-bold">{service}</span> from current to{' '}
            <span className="font-bold">{pendingRollback.version}</span>? Running deploy will be stopped.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => confirmRollback(pendingRollback)}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors"
            >
              &#8617; Confirm Rollback
            </button>
            <button
              onClick={() => setPendingRollback(null)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {deploys.map((d, i) => {
          const cfg = statusConfig[d.status] ?? statusConfig.success
          const isPending = pendingRollback?.id === d.id
          return (
            <div
              key={d.id}
              className={`flex items-center gap-3 rounded px-3 py-2 border bg-gray-900 flex-wrap transition-colors ${
                isPending ? 'border-red-700 bg-red-950' : 'border-gray-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
              <span className="text-xs font-semibold text-gray-200 w-14 shrink-0">{d.version}</span>
              {i === 0 && (
                <span className="px-1.5 py-0.5 bg-blue-900 border border-blue-700 rounded text-xs text-blue-300 shrink-0">LATEST</span>
              )}
              <span className={`text-xs ${cfg.text} w-20 shrink-0`}>{d.status}</span>
              <span className="text-xs text-gray-500">{elapsed(d.deployedAt)}</span>
              <span className="text-xs text-gray-600">{d.deployedBy}</span>
              {d.commitSha && (
                <span className="text-xs text-gray-700 bg-gray-800 px-1.5 rounded">{d.commitSha}</span>
              )}
              {d.changeCount != null && (
                <span className="text-xs text-gray-700">{d.changeCount} commits</span>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => setPendingRollback(isPending ? null : d)}
                  className={`px-2 py-0.5 border rounded text-xs transition-colors whitespace-nowrap ${
                    isPending
                      ? 'bg-gray-700 border-gray-600 text-gray-400'
                      : 'bg-red-900 hover:bg-red-800 border-red-700 text-red-300'
                  }`}
                >
                  {isPending ? 'Cancel' : <>&#8617; Rollback to {d.version}</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
