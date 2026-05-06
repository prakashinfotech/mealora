'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/types'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (newItem) => {
        const { items, restaurantId } = get()

        // If adding from a different restaurant, clear cart first
        if (restaurantId && restaurantId !== newItem.restaurantId) {
          set({
            items: [{ ...newItem, quantity: 1 }],
            restaurantId: newItem.restaurantId,
            restaurantName: newItem.restaurantName,
          })
          return
        }

        const existing = items.find((i) => i.menuItemId === newItem.menuItemId)
        if (existing) {
          set({
            items: items.map((i) =>
              i.menuItemId === newItem.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({
            items: [...items, { ...newItem, quantity: 1 }],
            restaurantId: newItem.restaurantId,
            restaurantName: newItem.restaurantName,
          })
        }
      },

      removeItem: (menuItemId) => {
        const next = get().items.filter((i) => i.menuItemId !== menuItemId)
        set({
          items: next,
          restaurantId: next.length === 0 ? null : get().restaurantId,
          restaurantName: next.length === 0 ? null : get().restaurantName,
        })
      },

      incrementItem: (menuItemId) => {
        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })
      },

      decrementItem: (menuItemId) => {
        const items = get().items
        const item = items.find((i) => i.menuItemId === menuItemId)
        if (!item) return

        if (item.quantity <= 1) {
          get().removeItem(menuItemId)
          return
        }
        set({
          items: items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        })
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'swiggy-cart',
    }
  )
)
