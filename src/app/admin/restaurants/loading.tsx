import { TableSkeleton } from '@/components/admin/ui/AdminSkeleton'

export default function AdminRestaurantsLoading() {
  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-6 w-32 rounded bg-slate-100 skeleton-shimmer" />
          <div className="h-4 w-48 rounded bg-slate-100 skeleton-shimmer" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-slate-100 skeleton-shimmer" />
      </div>
      <div className="flex gap-3">
        <div className="h-9 flex-1 rounded-lg bg-slate-100 skeleton-shimmer" />
        <div className="h-9 w-36 rounded-lg bg-slate-100 skeleton-shimmer" />
        <div className="h-9 w-36 rounded-lg bg-slate-100 skeleton-shimmer" />
      </div>
      <TableSkeleton rows={10} cols={6} />
    </div>
  )
}
