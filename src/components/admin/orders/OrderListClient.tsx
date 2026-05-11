'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge, ORDER_STATUS_VARIANT, PAYMENT_STATUS_VARIANT } from '@/components/admin/ui/AdminBadge'
import { AdminToast, type ToastData } from '@/components/admin/ui/AdminToast'
import { AdminInput, AdminSelect } from '@/components/admin/ui/AdminFormField'
import { formatPrice } from '@/lib/utils'

type OrderRow = {
  id: string
  status: string
  paymentMode: string
  paymentStatus: string
  total: number
  discount: number
  couponCode: string | null
  createdAt: string
  user: { id: string; name: string | null; email: string }
  restaurant: { id: string; name: string; area: string; city: string }
  _count: { items: number }
}

type PageData = {
  items: OrderRow[]
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
  return `/api/admin/orders?${q}`
}

function shortId(id: string) {
  return `#${id.slice(-8).toUpperCase()}`
}

const STATUS_OPTIONS = ['all', 'PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
const PAYMENT_STATUS_OPTIONS = ['all', 'PENDING', 'PAID', 'FAILED', 'REFUNDED']
const PAYMENT_MODE_OPTIONS = ['all', 'CASH_ON_DELIVERY', 'ONLINE', 'WALLET']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'total_desc', label: 'Amount: high to low' },
  { value: 'total_asc', label: 'Amount: low to high' },
]

const columns: AdminColumn<OrderRow>[] = [
  {
    key: 'id',
    header: 'Order',
    render: (row) => (
      <span className="font-mono text-xs font-semibold text-slate-700">{shortId(row.id)}</span>
    ),
  },
  {
    key: 'user',
    header: 'Customer',
    render: (row) => (
      <div>
        <p className="font-medium text-slate-800 text-xs">{row.user.name ?? '—'}</p>
        <p className="text-slate-400 text-xs">{row.user.email}</p>
      </div>
    ),
  },
  {
    key: 'restaurant',
    header: 'Restaurant',
    render: (row) => (
      <div>
        <p className="font-medium text-slate-800 text-xs">{row.restaurant.name}</p>
        <p className="text-slate-400 text-xs">{row.restaurant.area}, {row.restaurant.city}</p>
      </div>
    ),
  },
  {
    key: 'items',
    header: 'Items',
    render: (row) => <span className="text-xs text-slate-600">{row._count.items}</span>,
  },
  {
    key: 'total',
    header: 'Amount',
    render: (row) => (
      <div>
        <span className="font-semibold text-slate-800 text-xs">{formatPrice(row.total)}</span>
        {row.discount > 0 && (
          <p className="text-xs text-emerald-600">-{formatPrice(row.discount)} off</p>
        )}
      </div>
    ),
  },
  {
    key: 'payment',
    header: 'Payment',
    render: (row) => (
      <div className="space-y-1">
        <AdminBadge variant={PAYMENT_STATUS_VARIANT[row.paymentStatus] ?? 'slate'}>
          {row.paymentStatus}
        </AdminBadge>
        <p className="text-xs text-slate-400">{row.paymentMode.replace('_', ' ')}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <AdminBadge variant={ORDER_STATUS_VARIANT[row.status] ?? 'slate'}>
        {row.status.replace(/_/g, ' ')}
      </AdminBadge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Date',
    render: (row) => (
      <span className="text-xs text-slate-500">
        {new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
]

export function OrderListClient() {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [paymentMode, setPaymentMode] = useState('all')
  const [sort, setSort] = useState('newest')
  const [toast, setToast] = useState<ToastData | null>(null)
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(
    async (p: number, s: string, st: string, ps: string, pm: string, so: string) => {
      setLoading(true)
      try {
        const res = await fetch(
          buildUrl({ page: p, limit: LIMIT, search: s || undefined, status: st, paymentStatus: ps, paymentMode: pm, sort: so }),
        )
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
        fetchData(1, search, status, paymentStatus, paymentMode, sort)
      },
      search ? 350 : 0,
    )
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current)
    }
  }, [search, status, paymentStatus, paymentMode, sort, fetchData])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchData(newPage, search, status, paymentStatus, paymentMode, sort)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const total = data?.total ?? 0
  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  return (
    <div className="space-y-4">
      {toast && <AdminToast {...toast} onDismiss={() => setToast(null)} />}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <AdminInput
            placeholder="Search by order ID, customer, or restaurant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <AdminSelect value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.replace(/_/g, ' ')}</option>
            ))}
          </AdminSelect>
          <AdminSelect value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-36">
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All payments' : s}</option>
            ))}
          </AdminSelect>
          <AdminSelect value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-40">
            {PAYMENT_MODE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All modes' : s.replace(/_/g, ' ')}</option>
            ))}
          </AdminSelect>
          <AdminSelect value={sort} onChange={(e) => setSort(e.target.value)} className="w-44">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </AdminSelect>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${total.toLocaleString()} order${total !== 1 ? 's' : ''}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      <AdminTable
        columns={columns}
        data={(data?.items ?? []) as OrderRow[]}
        loading={loading}
        emptyMessage="No orders found"
        emptyDescription="Orders will appear here once customers start placing them."
        onRowClick={(row) => router.push(`/admin/orders/${row.id}`)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            {page} / {totalPages}
          </span>
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
