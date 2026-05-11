import Link from 'next/link'
import { CouponForm } from '@/components/admin/coupons/CouponForm'

export const metadata = { title: 'New Coupon' }

export default function AdminNewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1">
          <Link href="/admin/coupons" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Coupons
          </Link>
        </div>
        <h2 className="text-xl font-bold text-slate-800">New Coupon</h2>
        <p className="text-sm text-slate-500 mt-0.5">Create a new discount coupon for customers.</p>
      </div>
      <CouponForm mode="create" />
    </div>
  )
}
