"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLineItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  engraving?: string;
  metalFinish?: string;
  stock: number;
}

interface CartStore {
  items: CartLineItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartLineItem, "id" | "quantity"> & { id?: string; quantity?: number }) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function makeKey(productId: string, size?: string) {
  return `${productId}__${size ?? "nosize"}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const key = makeKey(item.productId, item.size);
        set((state) => {
          const existing = state.items.find(
            (i) => makeKey(i.productId, i.size) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                makeKey(i.productId, i.size) === key
                  ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                id: item.id ?? `${item.productId}-${Date.now()}`,
                quantity: 1,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size) => {
        const key = makeKey(productId, size);
        set((state) => ({
          items: state.items.filter((i) => makeKey(i.productId, i.size) !== key),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        const key = makeKey(productId, size);
        if (quantity < 1) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            makeKey(i.productId, i.size) === key
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      closeCart: () => set({ isOpen: false }),
      openCart: () => set({ isOpen: true }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "lumora-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
