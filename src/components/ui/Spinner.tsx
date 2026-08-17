import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin text-brand-primary', className ?? 'h-6 w-6')}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  )
}
