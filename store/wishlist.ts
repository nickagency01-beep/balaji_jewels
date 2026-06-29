"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) =>
          s.ids.includes(id) ? { ids: s.ids.filter((i) => i !== id) } : { ids: [...s.ids, id] }
        ),
      has: (id) => get().ids.includes(id),
    }),
    { name: "lumora-wishlist" }
  )
);
