import { cn } from '@/lib/utils'

interface Props {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function AdminFormSection({ title, description, children, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200', className)}>
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">
        {children}
      </div>
    </div>
  )
}

// Two-column grid helper for form fields
export function AdminFormGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode
  cols?: 1 | 2 | 3
  className?: string
}) {
  const colClass = { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }[cols]
  return (
    <div className={cn('grid grid-cols-1 gap-4', colClass, className)}>
      {children}
    </div>
  )
}
