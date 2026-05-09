'use client'

const SHIMMER_DELAYS = ['delay-0', 'delay-75', 'delay-150', 'delay-300']
const SHIMMER_WIDTHS = ['w-full', 'w-5/6', 'w-full', 'w-4/5']

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-700 bg-gray-950 p-8 font-mono flex items-center justify-center ring-1 ring-white/5">
      <span className="text-xs text-gray-600">{message}</span>
    </div>
  )
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950 p-5 font-mono space-y-3 ring-1 ring-white/5">
      <div className="h-3 bg-gray-800 rounded animate-pulse w-1/3 delay-0" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`h-8 bg-gray-800 rounded animate-pulse ${SHIMMER_DELAYS[i % SHIMMER_DELAYS.length]} ${SHIMMER_WIDTHS[i % SHIMMER_WIDTHS.length]}`}
        />
      ))}
    </div>
  )
}
