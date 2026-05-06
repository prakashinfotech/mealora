import { formatPrice } from '@/lib/utils'

interface Props {
  subtotal: number
  deliveryFee: number
  taxes: number
  discount?: number
}

export function CartSummary({ subtotal, deliveryFee, taxes, discount = 0 }: Props) {
  const total = subtotal + deliveryFee + taxes - discount

  return (
    <div className="space-y-2.5 text-sm">
      <div className="flex justify-between text-swiggy-gray">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-swiggy-gray">
        <span>Delivery fee</span>
        <span className={deliveryFee === 0 ? 'text-swiggy-green font-medium' : ''}>
          {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
        </span>
      </div>
      <div className="flex justify-between text-swiggy-gray">
        <span>Taxes &amp; charges</span>
        <span>{formatPrice(taxes)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-swiggy-green font-medium">
          <span>Discount</span>
          <span>− {formatPrice(discount)}</span>
        </div>
      )}
      <div className="border-t border-swiggy-border pt-3 flex justify-between font-bold text-swiggy-black">
        <span>To Pay</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
