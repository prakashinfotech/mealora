'use client'

import { useState } from 'react'
import { useCityStore } from '@/store/cityStore'
import type { ProfileAddress } from './ProfileContent'

interface Props {
  onSuccess: (address: ProfileAddress) => void
  onClose: () => void
}

const LABEL_OPTIONS = ['Home', 'Work', 'Other'] as const

export function AddressModal({ onSuccess, onClose }: Props) {
  const city = useCityStore((s) => s.city)

  const [form, setForm] = useState({
    label: 'Home' as typeof LABEL_OPTIONS[number],
    line1: '',
    line2: '',
    city: city,
    state: '',
    pincode: '',
    isDefault: false,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Pincode must be exactly 6 digits.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: form.label,
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode,
          isDefault: form.isDefault,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Failed to save address.')
      onSuccess(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-app-black">Add New Address</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-app-gray-bg text-app-gray transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label chips */}
          <div>
            <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-2">
              Label
            </label>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('label', l)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    form.label === l
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'border-app-border text-app-black hover:border-brand-primary'
                  }`}
                >
                  {l === 'Home' ? '🏠' : l === 'Work' ? '💼' : '📍'} {l}
                </button>
              ))}
            </div>
          </div>

          {/* Address line 1 */}
          <div>
            <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-1.5">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={form.line1}
              onChange={(e) => set('line1', e.target.value)}
              placeholder="Flat / House no., Building, Street"
              required
              className="w-full border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Address line 2 */}
          <div>
            <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-1.5">
              Address Line 2 <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.line2}
              onChange={(e) => set('line2', e.target.value)}
              placeholder="Area, Locality, Landmark"
              className="w-full border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
                className="w-full border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-1.5">
                State *
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                required
                className="w-full border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-semibold text-app-gray uppercase tracking-wide mb-1.5">
              Pincode *
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit pincode"
              required
              className="w-full border border-app-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Set as default */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => set('isDefault', e.target.checked)}
              className="w-4 h-4 accent-brand-primary"
            />
            <span className="text-sm font-medium text-app-black group-hover:text-brand-primary transition-colors">
              Set as default address
            </span>
          </label>

          {error && (
            <p className="text-xs font-semibold text-app-red bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-app-border text-sm font-semibold text-app-black hover:bg-app-gray-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-dark transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
