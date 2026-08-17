import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ label, value, sub, icon, trend, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-semibold',
              trend.value >= 0 ? 'text-emerald-600' : 'text-red-500',
            )}
          >
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
