'use client'
import { AgentComponentProps } from '../contracts/types'

interface OncallEngineer {
  name: string
  handle: string
  pagerdutyId: string
}

interface EscalateData {
  incidentId: string
  severity: string
  oncallEngineer: OncallEngineer
  slackChannel: string
  affectedUsers: number
  businessImpact: string
}

export function EscalateCard({ data, onAction }: AgentComponentProps) {
  const incident = data as unknown as EscalateData
  const isP1 = incident.severity === 'P1'

  return (
    <div className={`rounded-lg border p-5 font-mono ${
      isP1 ? 'border-red-800 bg-red-950/30' : 'border-yellow-800 bg-yellow-950/30'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`font-bold text-sm ${isP1 ? 'text-red-400' : 'text-yellow-400'}`}>
          &#9889; Escalate
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
          isP1 ? 'bg-red-500' : 'bg-yellow-600'
        }`}>{incident.severity}</span>
        <span className="text-gray-500 text-xs">{incident.incidentId}</span>
      </div>

      <div className="mb-4 bg-gray-900 rounded p-3">
        <p className="text-xs text-gray-500 mb-1">Business impact</p>
        <p className="text-xs text-gray-300">{incident.businessImpact}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">On-call engineer</p>
          <p className="text-sm text-blue-400">{incident.oncallEngineer?.name ?? '—'}</p>
          <p className="text-xs text-gray-600">{incident.oncallEngineer?.handle ?? '—'}</p>
        </div>
        <div className="bg-gray-900 rounded p-3">
          <p className="text-xs text-gray-500 mb-1">Slack channel</p>
          <p className="text-sm text-green-400">{incident.slackChannel}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAction({
            type: 'escalate_confirmed',
            label: 'Incident escalated',
            payload: { incidentId: incident.incidentId, engineer: incident.oncallEngineer?.handle },
            requiresConfirmation: true,
          })}
          className={`px-4 py-2 rounded text-xs font-bold transition-colors ${
            isP1 ? 'bg-red-600 hover:bg-red-500' : 'bg-yellow-700 hover:bg-yellow-600'
          }`}
        >
          Page {incident.oncallEngineer?.name ?? 'On-call'}
        </button>
        <button
          onClick={() => onAction({
            type: 'post_to_slack',
            label: 'Posted to Slack',
            payload: { channel: incident.slackChannel, incidentId: incident.incidentId },
          })}
          className="px-4 py-2 bg-green-800 hover:bg-green-700 rounded text-xs transition-colors"
        >
          Post to Slack
        </button>
      </div>
    </div>
  )
}
