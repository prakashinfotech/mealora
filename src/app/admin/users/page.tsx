import { UserListClient } from '@/components/admin/users/UserListClient'

export const metadata = { title: 'Users' }

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Users</h2>
        <p className="text-sm text-slate-500 mt-0.5">View all registered users and manage their roles.</p>
      </div>
      <UserListClient />
    </div>
  )
}
