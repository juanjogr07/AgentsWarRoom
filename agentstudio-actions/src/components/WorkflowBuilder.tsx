'use client'
import { useState } from 'react'
import { AgentComponentProps } from '../contracts/types'

type StepStatus = 'pending' | 'running' | 'done' | 'error'

interface WorkflowStep {
  id: number
  title: string
  tool: string
  status: StepStatus
}

interface WorkflowData {
  title: string
  steps: WorkflowStep[]
}

const statusConfig: Record<StepStatus, { icon: string; color: string }> = {
  pending: { icon: '&#9675;', color: 'text-gray-500' },
  running: { icon: '&#9680;', color: 'text-blue-400' },
  done: { icon: '&#9679;', color: 'text-green-400' },
  error: { icon: '&#10005;', color: 'text-red-400' },
}

export function WorkflowBuilder({ data, onAction }: AgentComponentProps) {
  const { title, steps: initialSteps } = data as unknown as WorkflowData
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps ?? [])
  const [running, setRunning] = useState(false)

  const runWorkflow = async () => {
    setRunning(true)
    for (let i = 0; i < steps.length; i++) {
      setSteps(s => s.map((step, j) => j === i ? { ...step, status: 'running' } : step))
      await new Promise(r => setTimeout(r, 900))
      setSteps(s => s.map((step, j) => j === i ? { ...step, status: 'done' } : step))
    }
    setRunning(false)
    onAction({ type: 'workflow_complete', label: 'Workflow complete', payload: { title } })
  }

  const allDone = steps.every(s => s.status === 'done')

  return (
    <div className="rounded-lg border border-blue-800 bg-blue-950/20 p-5 font-mono">
      <h3 className="text-sm font-semibold text-blue-300 mb-4">{title}</h3>

      <div className="space-y-2 mb-4">
        {steps.map(step => {
          const cfg = statusConfig[step.status]
          return (
            <div key={step.id} className="flex items-center gap-3 bg-gray-900 rounded px-3 py-2">
              <span
                className={`text-sm w-4 ${cfg.color}`}
                dangerouslySetInnerHTML={{ __html: cfg.icon }}
              />
              <span className="text-xs text-gray-300 flex-1">{step.title}</span>
              <span className="text-xs text-gray-600">{step.tool}</span>
            </div>
          )
        })}
      </div>

      {!allDone ? (
        <button
          onClick={runWorkflow}
          disabled={running}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 rounded text-xs font-bold transition-colors"
        >
          {running ? '&#9680; Running...' : '&#9654; Execute All Steps'}
        </button>
      ) : (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>&#10003;</span>
          <span>All steps complete</span>
        </div>
      )}
    </div>
  )
}
