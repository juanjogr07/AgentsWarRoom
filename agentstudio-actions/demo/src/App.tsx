import { useState } from 'react'
import {
  actionComponents,
  mockRollback,
  mockEscalate,
  mockMCPComposer,
  mockWorkflow,
} from '@agentstudio/actions'
import type { AgentAction } from '@agentstudio/actions'

const mockData: Record<string, Record<string, unknown>> = {
  RollbackCard: mockRollback as Record<string, unknown>,
  EscalateCard: mockEscalate as Record<string, unknown>,
  MCPComposer: mockMCPComposer as Record<string, unknown>,
  WorkflowBuilder: mockWorkflow as Record<string, unknown>,
}

interface LogEntry {
  id: number
  componentName: string
  action: AgentAction
  ts: string
}

export function App() {
  const [activeTab, setActiveTab] = useState(actionComponents[0].name)
  const [log, setLog] = useState<LogEntry[]>([])

  const handleAction = (componentName: string) => (action: AgentAction) => {
    setLog(prev => [
      {
        id: Date.now(),
        componentName,
        action,
        ts: new Date().toLocaleTimeString(),
      },
      ...prev,
    ])
  }

  const active = actionComponents.find(c => c.name === activeTab)!

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-12 border-b border-gray-800">
        <span className="text-sm font-bold text-white">
          M3 — Action Components Preview
        </span>
        <span className="text-xs text-gray-600">
          agentstudio-actions · {actionComponents.length} components
        </span>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-gray-800">
        {actionComponents.map(c => (
          <button
            key={c.name}
            onClick={() => setActiveTab(c.name)}
            className={`px-4 py-2 text-xs rounded-t transition-colors font-mono ${
              c.name === activeTab
                ? 'bg-gray-900 border border-b-gray-900 border-gray-700 text-white -mb-px'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Component preview */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <p className="text-xs text-gray-600 mb-4 font-mono">
              category: <span className="text-purple-400">{active.category}</span>
              {' · '}
              required data:{' '}
              <span className="text-cyan-400">
                {active.requiredData?.join(', ') ?? '—'}
              </span>
            </p>
            <active.component
              data={mockData[active.name] ?? {}}
              onAction={handleAction(active.name)}
            />
            <p className="text-xs text-gray-700 mt-4 leading-relaxed">
              {active.description}
            </p>
          </div>
        </div>

        {/* Action log */}
        <div className="w-80 border-l border-gray-800 flex flex-col bg-gray-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-mono">onAction log</span>
            {log.length > 0 && (
              <button
                onClick={() => setLog([])}
                className="text-xs text-gray-700 hover:text-gray-500"
              >
                clear
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {log.length === 0 ? (
              <p className="text-xs text-gray-700 font-mono text-center mt-8">
                Interact with the component
                <br />to see actions here
              </p>
            ) : (
              log.map(entry => (
                <div
                  key={entry.id}
                  className="rounded bg-gray-900 border border-gray-800 p-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-green-400 font-mono">
                      {entry.action.type}
                    </span>
                    <span className="text-xs text-gray-700">{entry.ts}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{entry.action.label}</p>
                  {entry.action.requiresConfirmation && (
                    <span className="text-xs text-orange-500">
                      requiresConfirmation: true
                    </span>
                  )}
                  {Object.keys(entry.action.payload).length > 0 && (
                    <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                      {JSON.stringify(entry.action.payload, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
