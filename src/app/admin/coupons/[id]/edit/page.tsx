import { notFound } from 'next/navigation'
import Link from 'next/link'
import { adminCouponService } from '@server/services/admin-coupon.service'
import { CouponForm } from '@/components/admin/coupons/CouponForm'

interface Props {
  params: { id: string }
}

export const metadata = { title: 'Edit Coupon' }

export default async function AdminEditCouponPage({ params }: Props) {
  let coupon: Awaited<ReturnType<typeof adminCouponService.findById>>

  try {
    coupon = await adminCouponService.findById(params.id)
  } catch {
    notFound()
  }

  const initialData = {
    id: coupon.id,
    code: coupon.code,
    title: coupon.title,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minOrderAmount: coupon.minOrderAmount,
    maxDiscount: coupon.maxDiscount,
    isActive: coupon.isActive,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
    usageLimit: coupon.usageLimit,
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1">
          <Link href="/admin/coupons" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Coupons
          </Link>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Edit Coupon</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          <span className="font-mono font-semibold text-slate-700">{coupon.code}</span>
          {' — '}{coupon.title}
        </p>
      </div>
      <CouponForm mode="edit" initialData={initialData} />
    </div>
  )
}
