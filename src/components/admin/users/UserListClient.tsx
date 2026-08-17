'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable, type AdminColumn } from '@/components/admin/ui/AdminTable'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { AdminInput, AdminSelect } from '@/components/admin/ui/AdminFormField'
import { formatPrice } from '@/lib/utils'

type UserRow = {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  createdAt: string
  totalSpent: number
  _count: { orders: number }
}

type PageData = {
  items: UserRow[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

const LIMIT = 20

const ROLE_VARIANT: Record<string, 'green' | 'purple' | 'blue' | 'slate'> = {
  ADMIN: 'purple',
  CUSTOMER: 'blue',
  RESTAURANT_OWNER: 'green',
}

function buildUrl(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'all') q.set(k, String(v))
  })
  return `/api/admin/users?${q}`
}

function formatRole(role: string) {
  if (role === 'RESTAURANT_OWNER') return 'Restaurant Owner'
  return role.charAt(0) + role.slice(1).toLowerCase()
}

const columns: AdminColumn<UserRow>[] = [
  {
    key: 'user',
    header: 'User',
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold shrink-0">
          {(row.name ?? row.email).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-slate-800 text-xs">{row.name ?? '—'}</p>
          <p className="text-slate-400 text-xs">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (row) => (
      <AdminBadge variant={ROLE_VARIANT[row.role] ?? 'slate'}>
        {formatRole(row.role)}
      </AdminBadge>
    ),
  },
  {
    key: 'orders',
    header: 'Orders',
    render: (row) => (
      <span className="text-xs text-slate-700 font-medium">{row._count.orders}</span>
    ),
  },
  {
    key: 'spent',
    header: 'Total Spent',
    render: (row) => (
      <span className="text-xs font-semibold text-slate-800">
        {row.totalSpent > 0 ? formatPrice(row.totalSpent) : '—'}
      </span>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (row) => (
      <span className="text-xs text-slate-500">
        {new Date(row.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </span>
    ),
  },
]

export function UserListClient() {
  const router = useRouter()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [sort, setSort] = useState('newest')
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async (p: number, s: string, r: string, so: string) => {
    setLoading(true)
    try {
      const res = await fetch(buildUrl({ page: p, limit: LIMIT, search: s || undefined, role: r, sort: so }))
      const json = await res.json()
      if (json.success) setData(json.data as PageData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current)
    searchRef.current = setTimeout(
      () => {
        setPage(1)
        fetchData(1, search, role, sort)
      },
      search ? 350 : 0,
    )
    return () => { if (searchRef.current) clearTimeout(searchRef.current) }
  }, [search, role, sort, fetchData])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchData(newPage, search, role, sort)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const total = data?.total ?? 0
  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <AdminInput
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />
          <AdminSelect value={role} onChange={(e) => setRole(e.target.value)} className="w-40">
            <option value="all">All roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
            <option value="RESTAURANT_OWNER">Restaurant Owner</option>
          </AdminSelect>
          <AdminSelect value={sort} onChange={(e) => setSort(e.target.value)} className="w-40">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
          </AdminSelect>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${total.toLocaleString()} user${total !== 1 ? 's' : ''}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
        )}
      </div>

      <AdminTable
        columns={columns}
        data={(data?.items ?? []) as UserRow[]}
        loading={loading}
        emptyMessage="No users found"
        emptyDescription="Users will appear here once they register."
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
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
