'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { AdminFormSection } from '@/components/admin/ui/AdminFormSection'
import { AdminFormField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminFormField'
import { AdminToggle } from '@/components/admin/ui/AdminToggle'
import { AdminMenuCategorySchema } from '@shared/schemas'
import { slugify } from '@/lib/utils'

type Category = {
  id: string
  restaurantId: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  _count: { items: number }
}

type FormMode = 'none' | 'create' | { editing: string }

type FormValues = {
  name: string
  slug: string
  description: string
  sortOrder: number
  isActive: boolean
}

const EMPTY_FORM: FormValues = {
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  isActive: true,
}

interface Props {
  restaurantId: string
}

export function CategoryListClient({ restaurantId }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('none')
  const [formValues, setFormValues] = useState<FormValues>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSaving, setFormSaving] = useState(false)
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/categories?isActive=all`)
      const json = await res.json()
      if (json.success) setCategories(json.data as Category[])
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setFormValues((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && formMode === 'create') {
        next.slug = slugify(value as string)
      }
      return next
    })
    setFormErrors((prev) => ({ ...prev, [key]: undefined as unknown as string }))
  }

  const openCreate = () => {
    setFormValues(EMPTY_FORM)
    setFormErrors({})
    setFormMode('create')
  }

  const openEdit = (cat: Category) => {
    setFormValues({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    })
    setFormErrors({})
    setFormMode({ editing: cat.id })
  }

  const closeForm = () => {
    setFormMode('none')
    setFormErrors({})
  }

  const handleSubmit = async () => {
    const parsed = AdminMenuCategorySchema.safeParse(formValues)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (key) errs[key] = issue.message
      }
      setFormErrors(errs)
      return
    }

    setFormSaving(true)
    try {
      const isEdit = typeof formMode === 'object'
      const url = isEdit
        ? `/api/admin/restaurants/${restaurantId}/categories/${formMode.editing}`
        : `/api/admin/restaurants/${restaurantId}/categories`
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Failed to save.')

      setToast({ type: 'success', message: isEdit ? 'Category updated.' : 'Category created.' })
      closeForm()
      fetchCategories()
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    } finally {
      setFormSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/categories/${confirm.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setToast({ type: 'success', message: `"${confirm.name}" deleted.` })
      setCategories((prev) => prev.filter((c) => c.id !== confirm.id))
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  const handleToggleActive = async (cat: Category) => {
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !cat.isActive }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !cat.isActive } : c))
      )
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update.' })
    }
  }

  const columns: AdminColumn<Category>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          {row.slug && <p className="text-xs text-slate-400 font-mono">{row.slug}</p>}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="text-slate-500 text-xs line-clamp-1">{row.description || '—'}</span>
      ),
    },
    {
      key: 'sortOrder',
      header: 'Sort',
      accessor: 'sortOrder',
      className: 'text-center',
      headerClassName: 'text-center',
    },
    {
      key: 'items',
      header: 'Items',
      render: (row) => (
        <span className="font-medium text-slate-700">{row._count.items}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <AdminBadge variant={row.isActive ? 'green' : 'red'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(row) }}
            className="text-xs font-semibold text-brand-orange hover:underline"
          >
            Edit
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleActive(row) }}
            className={`text-xs font-semibold transition-colors ${
              row.isActive ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'
            }`}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirm({ id: row.id, name: row.name }) }}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const showForm = formMode !== 'none'
  const isEditing = typeof formMode === 'object'

  return (
    <>
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      <ConfirmDialog
        open={!!confirm}
        title="Delete category?"
        description={`"${confirm?.name}" and all its items will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
        </p>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Category
          </button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="mb-5">
          <AdminFormSection title={isEditing ? 'Edit Category' : 'New Category'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminFormField label="Name" htmlFor="cat-name" required error={formErrors.name}>
                <AdminInput
                  id="cat-name"
                  value={formValues.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Starters"
                  autoFocus
                />
              </AdminFormField>
              <AdminFormField
                label="Slug"
                htmlFor="cat-slug"
                description="Auto-derived from name."
                error={formErrors.slug}
              >
                <AdminInput
                  id="cat-slug"
                  value={formValues.slug}
                  onChange={(e) =>
                    setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                  }
                  placeholder="starters"
                />
              </AdminFormField>
            </div>

            <AdminFormField label="Description" htmlFor="cat-desc" error={formErrors.description}>
              <AdminTextarea
                id="cat-desc"
                rows={2}
                value={formValues.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Optional short description…"
              />
            </AdminFormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <AdminFormField label="Sort order" htmlFor="cat-sort" error={formErrors.sortOrder}>
                <AdminInput
                  id="cat-sort"
                  type="number"
                  min={0}
                  value={formValues.sortOrder}
                  onChange={(e) => setField('sortOrder', parseInt(e.target.value) || 0)}
                />
              </AdminFormField>
              <div className="pt-6">
                <AdminToggle
                  label="Active"
                  description="Visible in the menu."
                  checked={formValues.isActive}
                  onChange={(v) => setField('isActive', v)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={formSaving}
                className="px-5 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
              >
                {formSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Category'}
              </button>
              <button
                onClick={closeForm}
                className="px-5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </AdminFormSection>
        </div>
      )}

      <AdminTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories yet"
        emptyDescription="Add your first category to start building the menu."
      />
    </>
  )
}
