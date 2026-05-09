'use client'
import type { AgentComponentProps } from '../contracts/types'
import { EmptyState } from './StateGuards'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface MetricData {
  metric: string
  unit: string
  data: Array<{ t: string; value: number }>
  threshold?: number
}

export function MetricsChart({ data, onAction, className }: AgentComponentProps) {
  const { metric, unit, data: points, threshold } = data as unknown as MetricData
  if (!points || points.length === 0) return <EmptyState message="No metric data" />
  const max = Math.max(...points.map((p: { value: number }) => p.value))
  const hasSpike = threshold != null && max > threshold

  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono ring-1 ring-white/5${className ? ` ${className}` : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">{metric}</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-600">unit: {unit}</span>
          {hasSpike && <span className="text-red-400">&#9888; threshold exceeded</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={points}>
          <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#6b7280' }} interval={4} />
          <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} width={36} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', fontSize: 11, borderRadius: 6, color: '#d1d5db' }}
            labelStyle={{ color: '#9ca3af', marginBottom: 2 }}
            cursor={{ stroke: '#374151', strokeWidth: 1 }}
            formatter={(v: number) => [`${v}${unit}`, metric]}
          />
          {threshold != null && (
            <ReferenceLine y={threshold} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.7} />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={hasSpike ? '#ef4444' : '#3b82f6'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {hasSpike && (
        <div className="mt-3">
          <button
            onClick={() => onAction({ type: 'create_incident', label: 'Create Incident', payload: { metric, value: max, threshold }, requiresConfirmation: true })}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-xs font-medium transition-colors"
          >
            + Create Incident
          </button>
        </div>
      )}
    </div>
  )
}
