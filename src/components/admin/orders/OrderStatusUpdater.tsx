'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSelect, AdminTextarea } from '@/components/admin/ui/AdminFormField'
import { AdminBadge, ORDER_STATUS_VARIANT } from '@/components/admin/ui/AdminBadge'

const ALL_STATUSES = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const
type OrderStatus = typeof ALL_STATUSES[number]

interface Props {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(currentStatus as OrderStatus)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isDirty = status !== currentStatus || note.trim() !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirty) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error ?? 'Failed to update status.')
        return
      }
      setSuccess(true)
      setNote('')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Update Status</h3>

      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5">Current</p>
        <AdminBadge variant={ORDER_STATUS_VARIANT[currentStatus] ?? 'slate'}>
          {currentStatus.replace(/_/g, ' ')}
        </AdminBadge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">New Status</label>
          <AdminSelect
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            disabled={loading}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </AdminSelect>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Note <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <AdminTextarea
            rows={2}
            placeholder="Add a note to the timeline…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-emerald-600">Status updated successfully.</p>}

        <button
          type="submit"
          disabled={!isDirty || loading}
          className="w-full py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold disabled:opacity-50 hover:bg-brand-primary/90 transition-colors"
        >
          {loading ? 'Updating…' : 'Update Status'}
        </button>
      </form>
    </div>
  )
}
