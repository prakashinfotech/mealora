'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminFormSection, AdminFormGrid } from '@/components/admin/ui/AdminFormSection'
import { AdminFormField, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/ui/AdminFormField'
import { AdminToggle } from '@/components/admin/ui/AdminToggle'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'

interface CouponData {
  id: string
  code: string
  title: string
  description: string | null
  discountType: string
  discountValue: number
  minOrderAmount: number | null
  maxDiscount: number | null
  isActive: boolean
  expiresAt: string | null
  usageLimit: number | null
}

interface Props {
  mode: 'create' | 'edit'
  initialData?: CouponData
}

type FormState = {
  code: string
  title: string
  description: string
  discountType: 'PERCENTAGE' | 'FLAT'
  discountValue: string
  minOrderAmount: string
  maxDiscount: string
  isActive: boolean
  expiresAt: string
  usageLimit: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function toFormState(data?: CouponData): FormState {
  if (!data) {
    return {
      code: '', title: '', description: '',
      discountType: 'PERCENTAGE', discountValue: '',
      minOrderAmount: '', maxDiscount: '',
      isActive: true, expiresAt: '', usageLimit: '',
    }
  }
  // Convert ISO datetime → local date string for <input type="date">
  const expiresAt = data.expiresAt
    ? new Date(data.expiresAt).toISOString().slice(0, 10)
    : ''
  return {
    code: data.code,
    title: data.title,
    description: data.description ?? '',
    discountType: data.discountType as 'PERCENTAGE' | 'FLAT',
    discountValue: String(data.discountValue),
    minOrderAmount: data.minOrderAmount != null ? String(data.minOrderAmount) : '',
    maxDiscount: data.maxDiscount != null ? String(data.maxDiscount) : '',
    isActive: data.isActive,
    expiresAt,
    usageLimit: data.usageLimit != null ? String(data.usageLimit) : '',
  }
}

function buildPayload(form: FormState) {
  return {
    code: form.code.trim().toUpperCase(),
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    discountType: form.discountType,
    discountValue: parseFloat(form.discountValue),
    minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
    maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
    isActive: form.isActive,
    // Send ISO datetime if date provided, else empty string → service maps to null on update
    expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59.000Z` : '',
    usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : undefined,
  }
}

export function CouponForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => toFormState(initialData))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.code.trim()) errs.code = 'Code is required.'
    if (!/^[A-Z0-9_-]+$/i.test(form.code.trim())) errs.code = 'Code may only contain letters, numbers, underscores, and hyphens.'
    if (!form.title.trim()) errs.title = 'Title is required.'
    const val = parseFloat(form.discountValue)
    if (!form.discountValue || isNaN(val) || val <= 0) errs.discountValue = 'Must be greater than 0.'
    if (form.discountType === 'PERCENTAGE' && val > 100) errs.discountValue = 'Percentage cannot exceed 100.'
    if (form.minOrderAmount && isNaN(parseFloat(form.minOrderAmount))) errs.minOrderAmount = 'Must be a valid number.'
    if (form.maxDiscount && isNaN(parseFloat(form.maxDiscount))) errs.maxDiscount = 'Must be a valid number.'
    if (form.usageLimit && (isNaN(parseInt(form.usageLimit, 10)) || parseInt(form.usageLimit, 10) < 1))
      errs.usageLimit = 'Must be a positive integer.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError(null)

    const payload = buildPayload(form)
    const url = mode === 'create' ? '/api/admin/coupons' : `/api/admin/coupons/${initialData!.id}`
    const method = mode === 'create' ? 'POST' : 'PATCH'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) {
        setServerError(json.error ?? 'Something went wrong.')
        return
      }
      setToast({ type: 'success', message: mode === 'create' ? 'Coupon created.' : 'Coupon updated.' })
      setTimeout(() => router.push('/admin/coupons'), 1200)
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      {/* Code & Basic Info */}
      <AdminFormSection title="Coupon Details">
        <AdminFormGrid cols={2}>
          <AdminFormField label="Coupon Code" required error={errors.code}>
            <AdminInput
              id="code"
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              placeholder="e.g. SAVE100"
              className="font-mono uppercase"
              disabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className="text-xs text-slate-400 mt-1">Code cannot be changed after creation.</p>
            )}
          </AdminFormField>
          <AdminFormField label="Title" required error={errors.title}>
            <AdminInput
              id="title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Save ₹100 on your order"
            />
          </AdminFormField>
        </AdminFormGrid>
        <AdminFormField label="Description" error={errors.description}>
          <AdminTextarea
            id="description"
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Optional description shown to customers"
          />
        </AdminFormField>
      </AdminFormSection>

      {/* Discount */}
      <AdminFormSection title="Discount Configuration">
        <AdminFormGrid cols={2}>
          <AdminFormField label="Discount Type" required>
            <AdminSelect
              value={form.discountType}
              onChange={(e) => set('discountType', e.target.value as 'PERCENTAGE' | 'FLAT')}
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </AdminSelect>
          </AdminFormField>
          <AdminFormField
            label={form.discountType === 'PERCENTAGE' ? 'Discount (%)' : 'Discount (₹)'}
            required
            error={errors.discountValue}
          >
            <AdminInput
              id="discountValue"
              type="number"
              min="0.01"
              step="0.01"
              max={form.discountType === 'PERCENTAGE' ? '100' : undefined}
              value={form.discountValue}
              onChange={(e) => set('discountValue', e.target.value)}
              placeholder={form.discountType === 'PERCENTAGE' ? '20' : '50'}
            />
          </AdminFormField>
        </AdminFormGrid>

        <AdminFormGrid cols={2}>
          <AdminFormField
            label="Minimum Order Amount (₹)"
            description="Leave blank for no minimum"
            error={errors.minOrderAmount}
          >
            <AdminInput
              id="minOrderAmount"
              type="number"
              min="0"
              step="1"
              value={form.minOrderAmount}
              onChange={(e) => set('minOrderAmount', e.target.value)}
              placeholder="e.g. 299"
            />
          </AdminFormField>
          {form.discountType === 'PERCENTAGE' && (
            <AdminFormField
              label="Max Discount Cap (₹)"
              description="Leave blank for no cap"
              error={errors.maxDiscount}
            >
              <AdminInput
                id="maxDiscount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.maxDiscount}
                onChange={(e) => set('maxDiscount', e.target.value)}
                placeholder="e.g. 150"
              />
            </AdminFormField>
          )}
        </AdminFormGrid>
      </AdminFormSection>

      {/* Validity */}
      <AdminFormSection title="Validity & Limits">
        <AdminFormGrid cols={2}>
          <AdminFormField
            label="Expiry Date"
            description="Leave blank for no expiry"
          >
            <AdminInput
              id="expiresAt"
              type="date"
              value={form.expiresAt}
              onChange={(e) => set('expiresAt', e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </AdminFormField>
          <AdminFormField
            label="Usage Limit"
            description="Max total redemptions. Leave blank for unlimited."
            error={errors.usageLimit}
          >
            <AdminInput
              id="usageLimit"
              type="number"
              min="1"
              step="1"
              value={form.usageLimit}
              onChange={(e) => set('usageLimit', e.target.value)}
              placeholder="e.g. 500"
            />
          </AdminFormField>
        </AdminFormGrid>
      </AdminFormSection>

      {/* Settings */}
      <AdminFormSection title="Settings">
        <AdminToggle
          label="Active"
          description="Inactive coupons cannot be applied by customers."
          checked={form.isActive}
          onChange={(v) => set('isActive', v)}
        />
      </AdminFormSection>

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold disabled:opacity-60 hover:bg-brand-primary/90 transition-colors"
        >
          {loading ? 'Saving…' : mode === 'create' ? 'Create Coupon' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/coupons')}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
