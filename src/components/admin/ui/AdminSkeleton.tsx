function Shimmer({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={`rounded bg-slate-100 skeleton-shimmer ${className}`} style={style} />
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Shimmer className="h-3 w-24 mb-2" />
          <Shimmer className="h-7 w-20" />
        </div>
        <Shimmer className="w-10 h-10 rounded-lg" />
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <Shimmer className="h-3 w-28" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <Shimmer className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-4 w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex gap-8">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-16" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-4 py-3.5 flex gap-8 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Shimmer key={c} className="h-4" style={{ width: `${60 + ((r + c) * 13) % 35}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
