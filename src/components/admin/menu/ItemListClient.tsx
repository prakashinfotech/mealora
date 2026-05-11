'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { AdminSelect } from '@/components/admin/ui/AdminFormField'
import { formatPrice } from '@/lib/utils'

type Category = { id: string; name: string }

type MenuItem = {
  id: string
  categoryId: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  isVeg: boolean
  isAvailable: boolean
  isActive: boolean
  isBestSeller: boolean
  isRecommended: boolean
  preparationTime: number | null
  sortOrder: number
  createdAt: string
  category: { id: string; name: string }
}

type PageData = {
  items: MenuItem[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

const LIMIT = 20

interface Props {
  restaurantId: string
  categories: Category[]
}

function buildUrl(restaurantId: string, params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'all') q.set(k, String(v))
  })
  return `/api/admin/restaurants/${restaurantId}/items?${q}`
}

export function ItemListClient({ restaurantId, categories }: Props) {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isVeg, setIsVeg] = useState('all')
  const [isActive, setIsActive] = useState('all')
  const [isAvailable, setIsAvailable] = useState('all')
  const [toast, setToast] = useState<ToastData | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(
    async (p: number, s: string, cId: string, veg: string, active: string, avail: string) => {
      setLoading(true)
      try {
        const res = await fetch(
          buildUrl(restaurantId, {
            page: p,
            limit: LIMIT,
            search: s || undefined,
            categoryId: cId || undefined,
            isVeg: veg,
            isActive: active,
            isAvailable: avail,
          }),
        )
        const json = await res.json()
        if (json.success) setData(json.data as PageData)
      } finally {
        setLoading(false)
      }
    },
    [restaurantId],
  )

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(
      () => { setPage(1); fetchData(1, search, categoryId, isVeg, isActive, isAvailable) },
      search ? 350 : 0,
    )
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search, categoryId, isVeg, isActive, isAvailable, fetchData])

  useEffect(() => {
    if (page > 1) fetchData(page, search, categoryId, isVeg, isActive, isAvailable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const patchItem = async (id: string, patch: Partial<MenuItem>) => {
    setToggling(id)
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) }
          : prev,
      )
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update.' })
    } finally {
      setToggling(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/items/${confirm.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setToast({ type: 'success', message: `"${confirm.name}" deleted.` })
      setData((prev) =>
        prev ? { ...prev, items: prev.items.filter((i) => i.id !== confirm.id), total: prev.total - 1 } : prev,
      )
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to delete.' })
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  function InlineToggle({
    item,
    field,
    label,
  }: {
    item: MenuItem
    field: 'isAvailable' | 'isActive'
    label: string
  }) {
    const on = item[field]
    return (
      <button
        onClick={() => patchItem(item.id, { [field]: !on })}
        disabled={toggling === item.id}
        title={`Toggle ${label}`}
        className={`w-8 h-4 rounded-full relative transition-colors ${
          on ? 'bg-emerald-500' : 'bg-slate-300'
        } disabled:opacity-40`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    )
  }

  const columns: AdminColumn<MenuItem>[] = [
    {
      key: 'name',
      header: 'Item',
      render: (row) => (
        <div className="flex items-start gap-2">
          <span
            className={`mt-0.5 shrink-0 w-3 h-3 rounded-sm border-2 ${
              row.isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'
            }`}
            title={row.isVeg ? 'Veg' : 'Non-veg'}
          />
          <div>
            <p className="font-semibold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">{row.category.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-medium">{formatPrice(row.price)}</span>,
    },
    {
      key: 'flags',
      header: 'Tags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isBestSeller && <AdminBadge variant="orange">Bestseller</AdminBadge>}
          {row.isRecommended && <AdminBadge variant="purple">Recommended</AdminBadge>}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'In Stock',
      render: (row) => <InlineToggle item={row} field="isAvailable" label="In Stock" />,
    },
    {
      key: 'active',
      header: 'Active',
      render: (row) => <InlineToggle item={row} field="isActive" label="Active" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/admin/restaurants/${restaurantId}/menu/items/${row.id}/edit`)
            }}
            className="text-xs font-semibold text-brand-orange hover:underline"
          >
            Edit
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

  return (
    <>
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      <ConfirmDialog
        open={!!confirm}
        title="Delete item?"
        description={`"${confirm?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        <AdminSelect value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-40">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </AdminSelect>

        <AdminSelect value={isVeg} onChange={(e) => setIsVeg(e.target.value)} className="w-32">
          <option value="all">Veg + Non-veg</option>
          <option value="true">Veg only</option>
          <option value="false">Non-veg only</option>
        </AdminSelect>

        <AdminSelect value={isActive} onChange={(e) => setIsActive(e.target.value)} className="w-32">
          <option value="all">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </AdminSelect>

        <AdminSelect value={isAvailable} onChange={(e) => setIsAvailable(e.target.value)} className="w-32">
          <option value="all">All stock</option>
          <option value="true">In stock</option>
          <option value="false">Out of stock</option>
        </AdminSelect>

        {data && (
          <span className="self-center text-xs text-slate-400 ml-auto">
            {data.total} item{data.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <AdminTable
        columns={columns}
        data={data?.items ?? []}
        loading={loading}
        emptyMessage="No items found"
        emptyDescription="Try adjusting your filters or create a new item."
      />

      {/* Pagination */}
      {data && data.total > LIMIT && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              disabled={!data.hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
