'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState } from './StateGuards'

interface OnCallPerson {
  name: string
  handle: string
  phone?: string
  schedule: string
  since: string
  until: string
}

interface OnCallStatusData {
  team: string
  primary: OnCallPerson
  secondary?: OnCallPerson
  escalationPolicy?: string
}

function formatUntil(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })
}

function PersonRow({
  person,
  tier,
  onPage,
}: {
  person: OnCallPerson
  tier: 'Primary' | 'Secondary'
  onPage: () => void
}) {
  const tierColor = tier === 'Primary' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-gray-800 text-gray-400 border-gray-700'
  const dotColor = tier === 'Primary' ? 'bg-green-400' : 'bg-gray-500'
  return (
    <div className="flex items-center gap-3 rounded px-3 py-2.5 border border-gray-800 bg-gray-900">
      <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-200">{person.name}</span>
          <span className="text-xs text-gray-500">{person.handle}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded border ${tierColor}`}>{tier}</span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">
          {person.schedule} · until {formatUntil(person.until)}
        </p>
        {person.phone && <p className="text-xs text-gray-700 mt-0.5">{person.phone}</p>}
      </div>
      <button
        onClick={onPage}
        className="px-2 py-1 bg-orange-900 hover:bg-orange-800 border border-orange-700 rounded text-xs text-orange-300 transition-colors shrink-0"
      >
        &#128222; Page
      </button>
    </div>
  )
}

export function OnCallStatus({ data, onAction, className }: AgentComponentProps) {
  const { team, primary, secondary, escalationPolicy } = data as unknown as OnCallStatusData
  if (!primary) return <EmptyState message="No on-call data" />

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">On-Call — {team ?? 'Unknown Team'}</h3>
        {escalationPolicy && (
          <span className="text-xs text-gray-500">{escalationPolicy}</span>
        )}
      </div>

      <div className="space-y-2">
        <PersonRow
          person={primary}
          tier="Primary"
          onPage={() => onAction({
            type: 'page_oncall',
            label: `Page ${primary.name}`,
            payload: { handle: primary.handle, tier: 'primary', team },
            requiresConfirmation: true,
          })}
        />
        {secondary && (
          <PersonRow
            person={secondary}
            tier="Secondary"
            onPage={() => onAction({
              type: 'page_oncall',
              label: `Page ${secondary.name}`,
              payload: { handle: secondary.handle, tier: 'secondary', team },
              requiresConfirmation: true,
            })}
          />
        )}
      </div>

      <button
        onClick={() => onAction({
          type: 'escalate',
          label: 'Escalate to On-Call',
          payload: { team, primaryHandle: primary.handle },
          requiresConfirmation: true,
        })}
        className="mt-4 w-full px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors"
      >
        &#9889; Escalate to On-Call
      </button>
    </div>
  )
}
