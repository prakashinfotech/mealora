import { CouponListClient } from '@/components/admin/coupons/CouponListClient'

export const metadata = { title: 'Coupons' }

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Coupons</h2>
        <p className="text-sm text-slate-500 mt-0.5">Create and manage discount coupons.</p>
      </div>
      <CouponListClient />
    </div>
  )
}
