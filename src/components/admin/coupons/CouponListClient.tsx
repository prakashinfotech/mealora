'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { AdminInput, AdminSelect } from '@/components/admin/ui/AdminFormField'
import { formatPrice } from '@/lib/utils'

type CouponRow = {
  id: string
  code: string
  title: string
  discountType: string
  discountValue: number
  minOrderAmount: number | null
  maxDiscount: number | null
  isActive: boolean
  expiresAt: string | null
  usageLimit: number | null
  usedCount: number
  createdAt: string
}

type PageData = {
  items: CouponRow[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

const LIMIT = 20

function buildUrl(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'all') q.set(k, String(v))
  })
  return `/api/admin/coupons?${q}`
}

function isExpired(expiresAt: string | null): boolean {
  return !!expiresAt && new Date(expiresAt) < new Date()
}

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return '—'
  const d = new Date(expiresAt)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function DiscountCell({ row }: { row: CouponRow }) {
  if (row.discountType === 'PERCENTAGE') {
    return (
      <div>
        <span className="font-semibold text-slate-800">{row.discountValue}%</span>
        {row.maxDiscount ? <p className="text-xs text-slate-400">max {formatPrice(row.maxDiscount)}</p> : null}
      </div>
    )
  }
  return <span className="font-semibold text-slate-800">{formatPrice(row.discountValue)}</span>
}

const columns: AdminColumn<CouponRow>[] = [
  {
    key: 'code',
    header: 'Code',
    render: (row) => (
      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
        {row.code}
      </span>
    ),
  },
  {
    key: 'title',
    header: 'Title',
    render: (row) => <span className="text-xs text-slate-700">{row.title}</span>,
  },
  {
    key: 'type',
    header: 'Type',
    render: (row) => (
      <AdminBadge variant={row.discountType === 'PERCENTAGE' ? 'blue' : 'purple'}>
        {row.discountType === 'PERCENTAGE' ? '%' : '₹'} {row.discountType === 'PERCENTAGE' ? 'Percent' : 'Flat'}
      </AdminBadge>
    ),
  },
  {
    key: 'value',
    header: 'Discount',
    render: (row) => <DiscountCell row={row} />,
  },
  {
    key: 'minOrder',
    header: 'Min Order',
    render: (row) => (
      <span className="text-xs text-slate-600">
        {row.minOrderAmount ? formatPrice(row.minOrderAmount) : '—'}
      </span>
    ),
  },
  {
    key: 'expiry',
    header: 'Expires',
    render: (row) => (
      <span className={`text-xs ${isExpired(row.expiresAt) ? 'text-red-500 font-medium' : 'text-slate-600'}`}>
        {formatExpiry(row.expiresAt)}
        {isExpired(row.expiresAt) && ' (expired)'}
      </span>
    ),
  },
  {
    key: 'usage',
    header: 'Usage',
    render: (row) => (
      <span className="text-xs text-slate-600">
        {row.usedCount}{row.usageLimit ? ` / ${row.usageLimit}` : ''}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <AdminBadge variant={row.isActive && !isExpired(row.expiresAt) ? 'green' : 'red'}>
        {row.isActive && !isExpired(row.expiresAt) ? 'Active' : row.isActive ? 'Expired' : 'Inactive'}
      </AdminBadge>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: () => null,
  },
]

export function CouponListClient() {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isActive, setIsActive] = useState('all')
  const [discountType, setDiscountType] = useState('all')
  const [expired, setExpired] = useState('all')
  const [toast, setToast] = useState<ToastData | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ id: string; code: string; nextActive: boolean } | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(
    async (p: number, s: string, a: string, t: string, e: string) => {
      setLoading(true)
      try {
        const res = await fetch(buildUrl({ page: p, limit: LIMIT, search: s || undefined, isActive: a, discountType: t, expired: e }))
        const json = await res.json()
        if (json.success) setData(json.data as PageData)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(
      () => {
        setPage(1)
        fetchData(1, search, isActive, discountType, expired)
      },
      search ? 350 : 0,
    )
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search, isActive, discountType, expired, fetchData])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchData(newPage, search, isActive, discountType, expired)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleConfirm = async () => {
    if (!confirm) return
    setToggling(confirm.id)
    setConfirm(null)
    try {
      const res = await fetch(`/api/admin/coupons/${confirm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: confirm.nextActive }),
      })
      const json = await res.json()
      if (json.success) {
        setData((prev) =>
          prev
            ? { ...prev, items: prev.items.map((c) => c.id === confirm.id ? { ...c, isActive: confirm.nextActive } : c) }
            : prev,
        )
        setToast({ type: 'success', message: `Coupon ${confirm.nextActive ? 'activated' : 'deactivated'}.` })
      } else {
        setToast({ type: 'error', message: json.error ?? 'Failed to update.' })
      }
    } catch {
      setToast({ type: 'error', message: 'Network error.' })
    } finally {
      setToggling(null)
    }
  }

  const columnsWithActions: AdminColumn<CouponRow>[] = columns.map((col) =>
    col.key !== 'actions'
      ? col
      : {
          ...col,
          render: (row) => (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/admin/coupons/${row.id}/edit`) }}
                className="text-xs font-semibold text-slate-600 hover:underline"
              >
                Edit
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirm({ id: row.id, code: row.code, nextActive: !row.isActive })
                }}
                disabled={toggling === row.id}
                className={`text-xs font-semibold hover:underline ${row.isActive ? 'text-red-500' : 'text-emerald-600'}`}
              >
                {toggling === row.id ? '…' : row.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ),
        },
  )

  const total = data?.total ?? 0
  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  return (
    <div className="space-y-4">
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.nextActive ? 'Activate Coupon' : 'Deactivate Coupon'}
        description={
          confirm?.nextActive
            ? `Activate coupon "${confirm?.code}"? It will become usable by customers.`
            : `Deactivate coupon "${confirm?.code}"? Customers will no longer be able to apply it.`
        }
        confirmLabel={confirm?.nextActive ? 'Activate' : 'Deactivate'}
        variant={confirm?.nextActive ? 'warning' : 'danger'}
        onConfirm={handleToggleConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <AdminInput
            placeholder="Search by code or title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
          <AdminSelect value={isActive} onChange={(e) => setIsActive(e.target.value)} className="w-36">
            <option value="all">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </AdminSelect>
          <AdminSelect value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-36">
            <option value="all">All types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </AdminSelect>
          <AdminSelect value={expired} onChange={(e) => setExpired(e.target.value)} className="w-36">
            <option value="all">All expiry</option>
            <option value="false">Not expired</option>
            <option value="true">Expired</option>
          </AdminSelect>
          <div className="ml-auto">
            <button
              onClick={() => router.push('/admin/coupons/new')}
              className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              + New Coupon
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${total.toLocaleString()} coupon${total !== 1 ? 's' : ''}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
        )}
      </div>

      <AdminTable
        columns={columnsWithActions}
        data={(data?.items ?? []) as CouponRow[]}
        loading={loading}
        emptyMessage="No coupons found"
        emptyDescription="Create a coupon to offer discounts to customers."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">{page} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
