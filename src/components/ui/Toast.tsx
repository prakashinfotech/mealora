'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface ToastState {
  type: 'success' | 'error'
  message: string
}

interface ToastProps extends ToastState {
  onDismiss: () => void
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3',
        'px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white',
        'animate-in fade-in slide-in-from-bottom-4 duration-300',
        type === 'success' ? 'bg-swiggy-green' : 'bg-swiggy-red'
      )}
    >
      <span className="text-base">{type === 'success' ? '✓' : '✕'}</span>
      {message}
      <button
        onClick={onDismiss}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity text-xs font-bold"
      >
        ✕
      </button>
    </div>
  )
}
