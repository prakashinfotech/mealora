import { cn } from '@/lib/utils'

type Variant = 'green' | 'red' | 'orange' | 'blue' | 'slate' | 'purple'

const VARIANT_CLASSES: Record<Variant, string> = {
  green:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red:    'bg-red-50 text-red-700 ring-red-200',
  orange: 'bg-orange-50 text-orange-700 ring-orange-200',
  blue:   'bg-blue-50 text-blue-700 ring-blue-200',
  slate:  'bg-slate-100 text-slate-600 ring-slate-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
}

interface Props {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function AdminBadge({ children, variant = 'slate', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

// Convenience helper — maps order status to badge variant
export const ORDER_STATUS_VARIANT: Record<string, Variant> = {
  PLACED:           'blue',
  ACCEPTED:         'purple',
  PREPARING:        'orange',
  READY:            'orange',
  OUT_FOR_DELIVERY: 'orange',
  DELIVERED:        'green',
  CANCELLED:        'red',
}

export const PAYMENT_STATUS_VARIANT: Record<string, Variant> = {
  PENDING:  'slate',
  PAID:     'green',
  FAILED:   'red',
  REFUNDED: 'purple',
}
