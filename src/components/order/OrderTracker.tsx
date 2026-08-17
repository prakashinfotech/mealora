'use client'

import { useEffect, useState } from 'react'
import { cn, ORDER_STATUS_LABELS } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const STATUS_STEPS: OrderStatus[] = [
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

const STATUS_ICONS: Record<OrderStatus, string> = {
  PLACED: '📋',
  ACCEPTED: '✅',
  PREPARING: '👨‍🍳',
  READY: '📦',
  OUT_FOR_DELIVERY: '🛵',
  DELIVERED: '🎉',
  CANCELLED: '❌',
}

interface Props {
  orderId: string
  initialStatus: OrderStatus
}

export function OrderTracker({ orderId, initialStatus }: Props) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(initialStatus)

  // Poll for status updates every 10s while order is active
  useEffect(() => {
    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        if (data.success) {
          setCurrentStatus(data.data.status)
        }
      } catch {
        // silently ignore polling errors
      }
    }, 10_000)

    return () => clearInterval(interval)
  }, [orderId, currentStatus])

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <span className="text-4xl">❌</span>
        <p className="font-bold text-app-red mt-3">Order Cancelled</p>
        <p className="text-sm text-app-gray mt-1">
          If you were charged, a refund will be processed in 3-5 business days.
        </p>
      </div>
    )
  }

  const currentIndex = STATUS_STEPS.indexOf(currentStatus)

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="font-bold text-app-black text-lg mb-6">
        {ORDER_STATUS_LABELS[currentStatus]}
      </h2>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-app-border" />
        <div
          className="absolute left-5 top-5 w-0.5 bg-brand-primary transition-all duration-700"
          style={{
            height: currentIndex > 0
              ? `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`
              : '0%',
          }}
        />

        <div className="space-y-6">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex
            const isCurrent = idx === currentIndex

            return (
              <div key={step} className="flex items-center gap-4 relative">
                <div
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 shrink-0',
                    isCompleted
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : isCurrent
                      ? 'bg-white border-brand-primary text-brand-primary'
                      : 'bg-white border-app-border text-app-gray-light'
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    STATUS_ICONS[step]
                  )}
                </div>

                <div>
                  <p className={cn(
                    'font-semibold text-sm',
                    isCurrent ? 'text-brand-primary' : isCompleted ? 'text-app-black' : 'text-app-gray-light'
                  )}>
                    {ORDER_STATUS_LABELS[step]}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-app-gray mt-0.5 animate-pulse">In progress...</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
