'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminFormField, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/ui/AdminFormField'
import { AdminFormSection, AdminFormGrid } from '@/components/admin/ui/AdminFormSection'
import { AdminImageField } from '@/components/admin/ui/AdminImageField'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { AdminToggle } from '@/components/admin/ui/AdminToggle'
import { AdminRestaurantSchema, type AdminRestaurantInput } from '@shared/schemas'
import { CITIES } from '@/lib/cities'
import { slugify } from '@/lib/utils'

type FormData = Partial<AdminRestaurantInput>

interface Props {
  mode: 'create' | 'edit'
  defaultValues?: FormData & { id?: string }
}

const COMMON_CUISINES = [
  'North Indian', 'South Indian', 'Chinese', 'Pizza', 'Burgers',
  'Biryani', 'Rolls', 'Desserts', 'Sushi', 'Pasta', 'Thali', 'Momos',
]


export function RestaurantForm({ mode, defaultValues }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof AdminRestaurantInput, string>>>({})

  const [form, setForm] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    bannerUrl: '',
    cuisines: [],
    city: CITIES[0].name,
    area: '',
    address: '',
    rating: 0,
    ratingCount: 0,
    avgDeliveryTime: 30,
    deliveryFee: 0,
    minOrderAmount: 0,
    isPureVeg: false,
    isOpen: true,
    isActive: true,
    isFeatured: false,
    ...defaultValues,
  })

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // Auto-derive slug from name in create mode only
      if (key === 'name' && mode === 'create') {
        next.slug = slugify(value as string)
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [mode])

  const toggleCuisine = (cuisine: string) => {
    const current = form.cuisines ?? []
    const next = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine]
    set('cuisines', next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Client-side validation
    const parsed = AdminRestaurantSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AdminRestaurantInput
        if (key) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      const url =
        mode === 'create'
          ? '/api/admin/restaurants'
          : `/api/admin/restaurants/${defaultValues?.id}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error ?? 'Failed to save.')

      setToast({ type: 'success', message: mode === 'create' ? 'Restaurant created!' : 'Restaurant updated!' })
      setTimeout(() => router.push('/admin/restaurants'), 1200)
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        {/* Basic info */}
        <AdminFormSection title="Basic Information">
          <AdminFormGrid cols={2}>
            <AdminFormField label="Name" htmlFor="name" required error={errors.name}>
              <AdminInput
                id="name"
                value={form.name ?? ''}
                onChange={(e) => set('name', e.target.value)}
                placeholder="McDonald's"
              />
            </AdminFormField>

            <AdminFormField
              label="Slug"
              htmlFor="slug"
              required
              description="URL-safe identifier. Auto-derived from name."
              error={errors.slug}
            >
              <AdminInput
                id="slug"
                value={form.slug ?? ''}
                onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="mcdonalds"
              />
            </AdminFormField>
          </AdminFormGrid>

          <AdminFormField label="Description" htmlFor="desc" error={errors.description}>
            <AdminTextarea
              id="desc"
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description of the restaurant…"
            />
          </AdminFormField>
        </AdminFormSection>

        {/* Location */}
        <AdminFormSection title="Location">
          <AdminFormGrid cols={2}>
            <AdminFormField label="City" htmlFor="city" required error={errors.city}>
              <AdminSelect
                id="city"
                value={form.city ?? ''}
                onChange={(e) => set('city', e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Area / Locality" htmlFor="area" required error={errors.area}>
              <AdminInput
                id="area"
                value={form.area ?? ''}
                onChange={(e) => set('area', e.target.value)}
                placeholder="Indiranagar"
              />
            </AdminFormField>
          </AdminFormGrid>

          <AdminFormField label="Full Address" htmlFor="address" required error={errors.address}>
            <AdminInput
              id="address"
              value={form.address ?? ''}
              onChange={(e) => set('address', e.target.value)}
              placeholder="100 Feet Rd, Indiranagar, Bangalore 560038"
            />
          </AdminFormField>
        </AdminFormSection>

        {/* Cuisines */}
        <AdminFormSection
          title="Cuisines"
          description="Select all applicable. At least one is required."
        >
          {errors.cuisines && (
            <p className="text-xs text-red-500">{errors.cuisines}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {COMMON_CUISINES.map((cuisine) => {
              const active = (form.cuisines ?? []).includes(cuisine)
              return (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-brand-primary'
                  }`}
                >
                  {cuisine}
                </button>
              )
            })}
          </div>
          <AdminFormField
            label="Other cuisines"
            htmlFor="cuisineOther"
            description="Comma-separated, e.g. Wraps, Sandwiches"
          >
            <AdminInput
              id="cuisineOther"
              placeholder="Wraps, Sandwiches"
              onBlur={(e) => {
                const extras = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                if (extras.length) {
                  const current = form.cuisines ?? []
                  const merged = Array.from(new Set([...current, ...extras]))
                  set('cuisines', merged)
                  e.target.value = ''
                }
              }}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* Delivery & pricing */}
        <AdminFormSection title="Delivery & Pricing">
          <AdminFormGrid cols={3}>
            <AdminFormField label="Delivery time (min)" htmlFor="deliveryTime" error={errors.avgDeliveryTime}>
              <AdminInput
                id="deliveryTime"
                type="number"
                min={1}
                max={120}
                value={form.avgDeliveryTime ?? 30}
                onChange={(e) => set('avgDeliveryTime', parseInt(e.target.value) || 30)}
              />
            </AdminFormField>

            <AdminFormField label="Delivery fee (₹)" htmlFor="deliveryFee" error={errors.deliveryFee}>
              <AdminInput
                id="deliveryFee"
                type="number"
                min={0}
                value={form.deliveryFee ?? 0}
                onChange={(e) => set('deliveryFee', parseFloat(e.target.value) || 0)}
              />
            </AdminFormField>

            <AdminFormField label="Min order (₹)" htmlFor="minOrder" error={errors.minOrderAmount}>
              <AdminInput
                id="minOrder"
                type="number"
                min={0}
                value={form.minOrderAmount ?? 0}
                onChange={(e) => set('minOrderAmount', parseFloat(e.target.value) || 0)}
              />
            </AdminFormField>
          </AdminFormGrid>

          <AdminFormGrid cols={2}>
            <AdminFormField label="Rating (0–5)" htmlFor="rating" error={errors.rating}>
              <AdminInput
                id="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating ?? 0}
                onChange={(e) => set('rating', parseFloat(e.target.value) || 0)}
              />
            </AdminFormField>

            <AdminFormField label="Rating count" htmlFor="ratingCount" error={errors.ratingCount}>
              <AdminInput
                id="ratingCount"
                type="number"
                min={0}
                value={form.ratingCount ?? 0}
                onChange={(e) => set('ratingCount', parseInt(e.target.value) || 0)}
              />
            </AdminFormField>
          </AdminFormGrid>
        </AdminFormSection>

        {/* Images */}
        <AdminFormSection title="Images" description="Paste public image URLs. Cloudinary/S3 upload coming soon.">
          <AdminFormGrid cols={2}>
            <AdminImageField
              label="Thumbnail image"
              id="imageUrl"
              value={form.imageUrl ?? ''}
              onChange={(v) => set('imageUrl', v)}
              error={errors.imageUrl}
              description="Square/portrait — shown in listing cards."
            />
            <AdminImageField
              label="Banner image"
              id="bannerUrl"
              value={form.bannerUrl ?? ''}
              onChange={(v) => set('bannerUrl', v)}
              error={errors.bannerUrl}
              description="Wide landscape — shown on restaurant detail page."
            />
          </AdminFormGrid>
        </AdminFormSection>

        {/* Flags */}
        <AdminFormSection title="Settings">
          <div className="space-y-4">
            <AdminToggle
              label="Active"
              description="Visible to customers. Deactivate to hide without deleting."
              checked={form.isActive ?? true}
              onChange={(v) => set('isActive', v)}
            />
            <AdminToggle
              label="Currently open"
              description="Accepting orders right now."
              checked={form.isOpen ?? true}
              onChange={(v) => set('isOpen', v)}
            />
            <AdminToggle
              label="Featured"
              description="Show in the featured section on the homepage."
              checked={form.isFeatured ?? false}
              onChange={(v) => set('isFeatured', v)}
            />
            <AdminToggle
              label="Pure veg"
              description="Only vegetarian items."
              checked={form.isPureVeg ?? false}
              onChange={(v) => set('isPureVeg', v)}
            />
          </div>
        </AdminFormSection>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : mode === 'create' ? 'Create Restaurant' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
