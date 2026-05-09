'use client'
import { useState } from 'react'
import { AgentComponentProps } from '../contracts/types'

interface Tool {
  name: string
  description: string
  actions: string[]
}

interface WorkflowStep {
  tool: string
  action: string
  params: Record<string, unknown>
}

interface MCPData {
  availableTools: Tool[]
  suggestedWorkflow: WorkflowStep[]
}

const toolColors: Record<string, string> = {
  slack: 'text-green-400 border-green-800',
  pagerduty: 'text-red-400 border-red-800',
  github: 'text-blue-400 border-blue-800',
  jira: 'text-indigo-400 border-indigo-800',
  monitor: 'text-cyan-400 border-cyan-800',
}

export function MCPComposer({ data, onAction }: AgentComponentProps) {
  const { availableTools, suggestedWorkflow } = data as unknown as MCPData
  const [steps] = useState(suggestedWorkflow ?? [])

  return (
    <div className="rounded-lg border border-purple-800 bg-purple-950/20 p-5 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-400 font-bold text-sm">&#9889; MCP Composer</span>
        <span className="text-xs text-gray-500">{availableTools?.length ?? 0} tools available</span>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {(availableTools ?? []).map(t => (
          <span
            key={t.name}
            className={`px-2 py-1 bg-gray-900 rounded-full border text-xs ${
              toolColors[t.name] ?? 'text-gray-400 border-gray-700'
            }`}
          >
            {t.name}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Suggested workflow</p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-900 rounded px-3 py-2">
              <span className="text-xs text-gray-600 w-4">{i + 1}</span>
              <span className={`text-xs font-medium w-20 ${
                toolColors[step.tool]?.split(' ')[0] ?? 'text-gray-400'
              }`}>
                {step.tool}
              </span>
              <span className="text-xs text-gray-400">{step.action}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onAction({
          type: 'execute_workflow',
          label: 'Workflow executed',
          payload: { steps },
          requiresConfirmation: true,
        })}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-xs font-bold transition-colors"
      >
        Execute Workflow
      </button>
    </div>
  )
}
