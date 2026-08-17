'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminFormField, AdminInput, AdminSelect, AdminTextarea } from '@/components/admin/ui/AdminFormField'
import { AdminFormSection, AdminFormGrid } from '@/components/admin/ui/AdminFormSection'
import { AdminImageField } from '@/components/admin/ui/AdminImageField'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { AdminToggle } from '@/components/admin/ui/AdminToggle'
import { AdminMenuItemSchema, type AdminMenuItemInput } from '@shared/schemas'

type FormData = Partial<AdminMenuItemInput>

interface Props {
  mode: 'create' | 'edit'
  restaurantId: string
  categories: { id: string; name: string }[]
  defaultValues?: FormData & { id?: string }
}

export function ItemForm({ mode, restaurantId, categories, defaultValues }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof AdminMenuItemInput, string>>>({})

  const [form, setForm] = useState<FormData>({
    categoryId: categories[0]?.id ?? '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isVeg: true,
    isAvailable: true,
    isActive: true,
    isBestSeller: false,
    isRecommended: false,
    preparationTime: undefined,
    sortOrder: 0,
    ...defaultValues,
  })

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parsed = AdminMenuItemSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AdminMenuItemInput
        if (key) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      const url =
        mode === 'create'
          ? `/api/admin/restaurants/${restaurantId}/items`
          : `/api/admin/restaurants/${restaurantId}/items/${defaultValues?.id}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.error ?? 'Failed to save.')

      setToast({
        type: 'success',
        message: mode === 'create' ? 'Item created!' : 'Item updated!',
      })
      setTimeout(() => router.push(`/admin/restaurants/${restaurantId}/menu/items`), 1200)
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
        <AdminFormSection title="Item Details">
          <AdminFormGrid cols={2}>
            <AdminFormField label="Name" htmlFor="item-name" required error={errors.name}>
              <AdminInput
                id="item-name"
                value={form.name ?? ''}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Paneer Butter Masala"
              />
            </AdminFormField>

            <AdminFormField label="Category" htmlFor="item-category" required error={errors.categoryId}>
              <AdminSelect
                id="item-category"
                value={form.categoryId ?? ''}
                onChange={(e) => set('categoryId', e.target.value)}
              >
                {categories.length === 0 && (
                  <option value="" disabled>No categories — create one first</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </AdminSelect>
            </AdminFormField>
          </AdminFormGrid>

          <AdminFormField label="Description" htmlFor="item-desc" error={errors.description}>
            <AdminTextarea
              id="item-desc"
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description of the item…"
            />
          </AdminFormField>
        </AdminFormSection>

        {/* Pricing */}
        <AdminFormSection title="Pricing & Timing">
          <AdminFormGrid cols={3}>
            <AdminFormField label="Price (₹)" htmlFor="item-price" required error={errors.price}>
              <AdminInput
                id="item-price"
                type="number"
                min={0}
                step={0.5}
                value={form.price ?? 0}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
              />
            </AdminFormField>

            <AdminFormField
              label="Prep time (min)"
              htmlFor="item-prep"
              description="Optional. How long to prepare."
              error={errors.preparationTime}
            >
              <AdminInput
                id="item-prep"
                type="number"
                min={1}
                max={120}
                value={form.preparationTime ?? ''}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  set('preparationTime', isNaN(v) ? undefined : v)
                }}
                placeholder="e.g. 15"
              />
            </AdminFormField>

            <AdminFormField label="Sort order" htmlFor="item-sort" error={errors.sortOrder}>
              <AdminInput
                id="item-sort"
                type="number"
                min={0}
                value={form.sortOrder ?? 0}
                onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)}
              />
            </AdminFormField>
          </AdminFormGrid>
        </AdminFormSection>

        {/* Image */}
        <AdminFormSection title="Image" description="Paste a public image URL. Upload support coming soon.">
          <AdminImageField
            label="Item image"
            id="item-image"
            value={form.imageUrl ?? ''}
            onChange={(v) => set('imageUrl', v)}
            error={errors.imageUrl}
            description="Square format recommended."
          />
        </AdminFormSection>

        {/* Flags */}
        <AdminFormSection title="Settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminToggle
              label="Vegetarian"
              description="Mark this item as veg."
              checked={form.isVeg ?? true}
              onChange={(v) => set('isVeg', v)}
            />
            <AdminToggle
              label="Active"
              description="Visible in the menu."
              checked={form.isActive ?? true}
              onChange={(v) => set('isActive', v)}
            />
            <AdminToggle
              label="In Stock"
              description="Currently available to order."
              checked={form.isAvailable ?? true}
              onChange={(v) => set('isAvailable', v)}
            />
            <AdminToggle
              label="Bestseller"
              description="Show bestseller tag."
              checked={form.isBestSeller ?? false}
              onChange={(v) => set('isBestSeller', v)}
            />
            <AdminToggle
              label="Recommended"
              description="Show recommended tag."
              checked={form.isRecommended ?? false}
              onChange={(v) => set('isRecommended', v)}
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
            {saving ? 'Saving…' : mode === 'create' ? 'Create Item' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/restaurants/${restaurantId}/menu/items`)}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
