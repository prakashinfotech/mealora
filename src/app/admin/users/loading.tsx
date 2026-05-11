export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-1.5">
        <div className="h-6 w-20 rounded bg-slate-100 skeleton-shimmer" />
        <div className="h-4 w-60 rounded bg-slate-100 skeleton-shimmer" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-3">
          {[240, 160, 160].map((w, i) => (
            <div key={i} className="h-9 rounded-lg bg-slate-100 skeleton-shimmer" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex gap-8">
          {['User', 'Role', 'Orders', 'Total Spent', 'Joined'].map((h) => (
            <div key={h} className="h-3 w-16 rounded bg-slate-200 skeleton-shimmer" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-slate-100 flex gap-8 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 skeleton-shimmer shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 rounded bg-slate-100 skeleton-shimmer" />
                <div className="h-3 w-40 rounded bg-slate-100 skeleton-shimmer" />
              </div>
            </div>
            {[72, 40, 80, 80].map((w, j) => (
              <div key={j} className="h-4 rounded bg-slate-100 skeleton-shimmer" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
