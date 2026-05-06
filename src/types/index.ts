// Re-export shared interfaces so existing @/types imports continue to work.
// New code should import directly from @shared/interfaces.
export * from '@shared/interfaces'

// ─── Frontend-only types ──────────────────────────────────────────────────────

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  imageUrl?: string | null
  isVeg: boolean
  quantity: number
  restaurantId: string
  restaurantName: string
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (menuItemId: string) => void
  incrementItem: (menuItemId: string) => void
  decrementItem: (menuItemId: string) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}
