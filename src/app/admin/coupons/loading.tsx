export default function AdminCouponsLoading() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="space-y-1.5">
        <div className="h-6 w-24 rounded bg-slate-100 skeleton-shimmer" />
        <div className="h-4 w-52 rounded bg-slate-100 skeleton-shimmer" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          {[224, 144, 144, 144].map((w, i) => (
            <div key={i} className="h-9 rounded-lg bg-slate-100 skeleton-shimmer" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex gap-6">
          {['Code', 'Title', 'Type', 'Discount', 'Min Order', 'Expires', 'Usage', 'Status'].map((h) => (
            <div key={h} className="h-3 w-14 rounded bg-slate-200 skeleton-shimmer" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-slate-100 flex gap-6">
            {[96, 160, 80, 72, 72, 96, 56, 72].map((w, j) => (
              <div key={j} className="h-4 rounded bg-slate-100 skeleton-shimmer" style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
