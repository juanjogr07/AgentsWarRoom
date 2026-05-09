'use client'
import { useState } from 'react'
import { AgentComponentProps } from '../contracts/types'

interface RollbackData {
  service: string
  currentVersion: string
  targetVersion: string
  deployedAt: string
  changes: string[]
  estimatedTime: string
  affectedUsers: number
}

export function RollbackCard({ data, onAction }: AgentComponentProps) {
  const [confirming, setConfirming] = useState(false)
  const rollback = data as unknown as RollbackData

  return (
    <div className="rounded-lg border border-orange-800 bg-orange-950/30 p-5 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-orange-400 font-bold text-sm">&#8617; Rollback</span>
        <span className="text-gray-400 text-xs">{rollback.service}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Current (will revert)</p>
          <p className="text-red-400 text-sm font-bold">{rollback.currentVersion}</p>
        </div>
        <div className="bg-gray-900 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Target (stable)</p>
          <p className="text-green-400 text-sm font-bold">{rollback.targetVersion}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Changes being reverted</p>
        <ul className="space-y-1">
          {(rollback.changes ?? []).map((c, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-2">
              <span className="text-red-500">-</span>{c}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span>&#9201; ~{rollback.estimatedTime ?? 'calculating...'}</span>
        <span>&#128101; {rollback.affectedUsers?.toLocaleString() ?? 'N/A'} users</span>
      </div>

      {!confirming ? (
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded text-xs font-bold transition-colors"
          >
            Confirm Rollback
          </button>
          <button
            onClick={() => onAction({ type: 'cancel', label: 'Cancel', payload: {} })}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-orange-900/50 border border-orange-700 rounded p-3">
          <p className="text-xs text-orange-300 mb-3">
            &#9888; This will rollback {rollback.service} and may briefly affect {rollback.affectedUsers?.toLocaleString() ?? 'some'} users. Confirm?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onAction({ type: 'rollback_confirmed', label: 'Rollback confirmed', payload: { ...rollback }, requiresConfirmation: false })}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold transition-colors"
            >
              Yes, Roll Back Now
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
