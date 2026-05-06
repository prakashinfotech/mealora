import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'red' | 'orange' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-brand-orange-light text-brand-orange',
    gray: 'bg-swiggy-gray-bg text-swiggy-gray',
  }

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-4 h-4 rounded-sm border-2',
        isVeg ? 'border-swiggy-green' : 'border-swiggy-red'
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          isVeg ? 'bg-swiggy-green' : 'bg-swiggy-red'
        )}
      />
    </span>
  )
}
