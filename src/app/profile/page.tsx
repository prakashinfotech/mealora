import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProfileContent } from '@/components/profile/ProfileContent'
import { userService } from '@server/services/user.service'
import { orderService } from '@server/services/order.service'
import { addressService } from '@server/services/address.service'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account' }

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/profile')

  const [dbUser, orders, addresses] = await Promise.all([
    userService.findById(session.user.id),
    orderService.listForUser(session.user.id).then((r) => r.items),
    addressService.listForUser(session.user.id),
  ])

  // Serialize for client component — Dates become ISO strings
  const user = {
    id: session.user.id,
    name: dbUser?.name ?? session.user.name ?? 'User',
    email: dbUser?.email ?? session.user.email ?? '',
    phone: dbUser?.phone ?? null,
    image: dbUser?.image ?? session.user.image ?? null,
    createdAt: (dbUser?.createdAt ?? new Date()).toISOString(),
  }

  const serializedOrders = orders.map((o) => ({
    id: o.id,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    restaurant: o.restaurant,
    items: o.items,
  }))

  const serializedAddresses = addresses.map((a) => ({
    id: a.id,
    label: a.label,
    line1: a.line1,
    line2: a.line2 ?? null,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
  }))

  return (
    <>
      <Navbar />
      <ProfileContent
        user={user}
        orders={serializedOrders}
        addresses={serializedAddresses}
      />
      <Footer />
    </>
  )
}
