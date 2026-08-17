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
      <div className="flex justify-between text-app-gray">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-app-gray">
        <span>Delivery fee</span>
        <span className={deliveryFee === 0 ? 'text-app-green font-medium' : ''}>
          {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
        </span>
      </div>
      <div className="flex justify-between text-app-gray">
        <span>Taxes &amp; charges</span>
        <span>{formatPrice(taxes)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-app-green font-medium">
          <span>Discount</span>
          <span>− {formatPrice(discount)}</span>
        </div>
      )}
      <div className="border-t border-app-border pt-3 flex justify-between font-bold text-app-black">
        <span>To Pay</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
