'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'

const ROLE_VARIANT: Record<string, 'purple' | 'blue' | 'green'> = {
  ADMIN: 'purple',
  CUSTOMER: 'blue',
  RESTAURANT_OWNER: 'green',
}

function formatRole(role: string) {
  if (role === 'RESTAURANT_OWNER') return 'Restaurant Owner'
  return role.charAt(0) + role.slice(1).toLowerCase()
}

interface Props {
  userId: string
  currentRole: string
}

export function UserRoleUpdater({ userId, currentRole }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<{ role: 'CUSTOMER' | 'ADMIN'; label: string } | null>(null)

  const isSelf = session?.user?.id === userId
  // Only toggle between CUSTOMER ↔ ADMIN
  const canPromote = currentRole === 'CUSTOMER'
  const canDemote = currentRole === 'ADMIN'

  const handleConfirm = async () => {
    if (!confirm) return
    setLoading(true)
    setError(null)
    setConfirm(null)

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: confirm.role }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error ?? 'Failed to update role.')
        return
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Role</h3>

      <div className="mb-4">
        <AdminBadge variant={ROLE_VARIANT[currentRole] ?? 'slate'}>
          {formatRole(currentRole)}
        </AdminBadge>
      </div>

      {isSelf && (
        <p className="text-xs text-slate-400 italic">You cannot change your own role.</p>
      )}

      {!isSelf && currentRole === 'RESTAURANT_OWNER' && (
        <p className="text-xs text-slate-400">Restaurant Owner roles are managed separately.</p>
      )}

      {!isSelf && (canPromote || canDemote) && (
        <div className="space-y-2">
          {canPromote && (
            <button
              onClick={() => setConfirm({ role: 'ADMIN', label: 'Promote to Admin' })}
              disabled={loading}
              className="w-full py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Promote to Admin'}
            </button>
          )}
          {canDemote && (
            <button
              onClick={() => setConfirm({ role: 'CUSTOMER', label: 'Demote to Customer' })}
              disabled={loading}
              className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Demote to Customer'}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.label ?? ''}
        description={
          confirm?.role === 'ADMIN'
            ? 'This user will gain full admin access to the panel. Are you sure?'
            : 'This user will lose admin access and become a regular customer. Are you sure?'
        }
        confirmLabel={confirm?.label ?? 'Confirm'}
        variant={confirm?.role === 'ADMIN' ? 'warning' : 'danger'}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
