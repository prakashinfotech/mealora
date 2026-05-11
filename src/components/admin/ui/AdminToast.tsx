'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface ToastData {
  type: 'success' | 'error'
  message: string
}

interface Props extends ToastData {
  onDismiss: () => void
}

export function AdminToast({ type, message, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5',
        'rounded-xl shadow-xl text-sm font-semibold text-white max-w-sm',
        'animate-fade-in',
        type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
      )}
    >
      <span className="shrink-0 text-base">{type === 'success' ? '✓' : '✕'}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-1"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function useToast() {
  // Minimal hook — component manages its own state via useState
  // Usage: const [toast, setToast] = useState<ToastData | null>(null)
  //        {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}
}
