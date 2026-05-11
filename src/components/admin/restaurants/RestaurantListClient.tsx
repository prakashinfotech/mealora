'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { AdminSelect } from '@/components/admin/ui/AdminFormField'
import { CITIES } from '@/lib/cities'
import { formatPrice } from '@/lib/utils'

type Restaurant = {
  id: string
  name: string
  city: string
  area: string
  cuisines: string[]
  rating: number
  avgDeliveryTime: number
  deliveryFee: number
  isOpen: boolean
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

type PageData = {
  items: Restaurant[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

const LIMIT = 20

function buildUrl(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v))
  })
  return `/api/admin/restaurants?${q}`
}

export function RestaurantListClient() {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [isActive, setIsActive] = useState('all')
  const [toast, setToast] = useState<ToastData | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; name: string; nextActive: boolean } | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async (p: number, s: string, c: string, a: string) => {
    setLoading(true)
    try {
      const res = await fetch(buildUrl({ page: p, limit: LIMIT, search: s || undefined, city: c || undefined, isActive: a }))
      const json = await res.json()
      if (json.success) setData(json.data as PageData)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + re-fetch on filter change
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setPage(1)
      fetchData(1, search, city, isActive)
    }, search ? 350 : 0)
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search, city, isActive, fetchData])

  // Page change
  useEffect(() => {
    if (page > 1) fetchData(page, search, city, isActive)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleToggleIntent = (row: Restaurant) => {
    setConfirm({ id: row.id, name: row.name, nextActive: !row.isActive })
  }

  const handleToggleConfirm = async () => {
    if (!confirm) return
    setToggling(confirm.id)
    try {
      const res = await fetch(`/api/admin/restaurants/${confirm.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: confirm.nextActive }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      // Optimistic update in local state
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((r) => r.id === confirm.id ? { ...r, isActive: confirm.nextActive } : r) }
          : prev
      )
      setToast({ type: 'success', message: `"${confirm.name}" ${confirm.nextActive ? 'activated' : 'deactivated'}.` })
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to update status.' })
    } finally {
      setToggling(null)
      setConfirm(null)
    }
  }

  const columns: AdminColumn<Restaurant>[] = [
    {
      key: 'name',
      header: 'Restaurant',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.area}, {row.city}</p>
        </div>
      ),
    },
    {
      key: 'cuisines',
      header: 'Cuisines',
      render: (row) => (
        <span className="text-slate-500">{row.cuisines.slice(0, 2).join(', ')}{row.cuisines.length > 2 ? ` +${row.cuisines.length - 2}` : ''}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => (
        <span className="font-medium">★ {row.rating.toFixed(1)}</span>
      ),
    },
    {
      key: 'deliveryFee',
      header: 'Delivery',
      render: (row) => (
        <span>{row.avgDeliveryTime} min · {row.deliveryFee === 0 ? 'FREE' : formatPrice(row.deliveryFee)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <AdminBadge variant={row.isActive ? 'green' : 'red'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </AdminBadge>
          {row.isFeatured && <AdminBadge variant="purple">Featured</AdminBadge>}
          {row.isOpen && <AdminBadge variant="blue">Open</AdminBadge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/restaurants/${row.id}/menu`) }}
            className="text-xs font-semibold text-slate-600 hover:underline"
          >
            Menu
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/restaurants/${row.id}/edit`) }}
            className="text-xs font-semibold text-brand-orange hover:underline"
          >
            Edit
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleIntent(row) }}
            disabled={toggling === row.id}
            className={`text-xs font-semibold transition-colors ${
              row.isActive ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'
            } disabled:opacity-40`}
          >
            {toggling === row.id ? '…' : row.isActive ? 'Deactivate' : 'Activate'}
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
        title={confirm?.nextActive ? 'Activate restaurant?' : 'Deactivate restaurant?'}
        description={
          confirm?.nextActive
            ? `"${confirm.name}" will become visible to customers.`
            : `"${confirm?.name}" will be hidden from customers. No data is deleted.`
        }
        confirmLabel={confirm?.nextActive ? 'Activate' : 'Deactivate'}
        variant={confirm?.nextActive ? 'warning' : 'danger'}
        loading={toggling !== null}
        onConfirm={handleToggleConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
          />
        </div>

        <AdminSelect
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-36"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </AdminSelect>

        <AdminSelect
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="w-36"
        >
          <option value="all">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </AdminSelect>

        {data && (
          <span className="self-center text-xs text-slate-400 ml-auto">
            {data.total} restaurant{data.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={data?.items ?? []}
        loading={loading}
        emptyMessage="No restaurants found"
        emptyDescription="Try adjusting your filters or create a new restaurant."
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
