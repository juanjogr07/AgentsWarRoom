'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState, LoadingState } from './StateGuards'

type TaskStatus = 'in_flight' | 'blocked' | 'done'

interface Task {
  id: string
  title: string
  status: TaskStatus
  assignee: string
  blocker?: string
}

interface SprintData {
  sprintName: string
  daysRemaining: number
  tasks: Task[]
}

const taskConfig: Record<TaskStatus, { label: string; text: string; bg: string; border: string }> = {
  in_flight: { label: 'In Flight', text: 'text-blue-400', bg: 'bg-blue-950', border: 'border-blue-900' },
  blocked:   { label: 'Blocked',   text: 'text-red-400',  bg: 'bg-red-950',  border: 'border-red-900'  },
  done:      { label: 'Done',      text: 'text-green-400',bg: 'bg-green-950',border: 'border-green-900'},
}

function DaysLabel({ days }: { days: number }) {
  if (days <= 0) return <span className="text-xs text-red-400 font-semibold">OVERDUE</span>
  if (days === 1) return <span className="text-xs text-yellow-400">1d left</span>
  return <span className="text-xs text-gray-500">{days}d left</span>
}

export function SprintBoard({ data, onAction, className }: AgentComponentProps) {
  const { sprintName, daysRemaining, tasks } = data as unknown as SprintData
  if (!tasks) return <LoadingState rows={3} />
  if (tasks.length === 0) return <EmptyState message="No tasks in sprint" />

  const blocked = tasks.filter(t => t.status === 'blocked').length
  const done = tasks.filter(t => t.status === 'done').length

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 truncate">{sprintName}</h3>
        <div className="flex gap-4 text-xs shrink-0 ml-3">
          {blocked > 0 && <span className="text-red-400">{blocked} blocked</span>}
          {done > 0 && <span className="text-green-400">{done} done</span>}
          <DaysLabel days={daysRemaining} />
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map(t => {
          const cfg = taskConfig[t.status] ?? taskConfig.in_flight
          return (
            <div key={t.id} className={`rounded border ${cfg.border} ${cfg.bg} px-3 py-2`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-600 shrink-0">{t.id}</span>
                <span className="text-xs text-gray-200 flex-1 truncate">{t.title}</span>
                <span className={`text-xs ${cfg.text} shrink-0`}>{cfg.label}</span>
                <span className="text-xs text-gray-600 shrink-0">{t.assignee}</span>
                {t.status === 'blocked' && (
                  <button
                    onClick={() => onAction({ type: 'unblock_task', label: `Unblock ${t.id}`, payload: { taskId: t.id, blocker: t.blocker } })}
                    className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors shrink-0"
                  >
                    Unblock
                  </button>
                )}
              </div>
              {t.blocker && (
                <p className="text-xs text-red-300 mt-1 ml-8 line-clamp-2">&#9889; {t.blocker}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
