"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById } from "./products";
import { isSockSize, type CartItem, type SockSize } from "./types";

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  setHydrated: () => void;
  addItem: (productId: string, size: SockSize, qty?: number) => void;
  updateQty: (productId: string, size: SockSize, qty: number) => void;
  removeItem: (productId: string, size: SockSize) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addItem: (productId, size, qty = 1) => {
        if (!isSockSize(size)) return;
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId && item.size === size,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId && item.size === size
                  ? { ...item, qty: Math.min(12, item.qty + qty) }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { productId, size, qty }] };
        });
      },
      updateQty: (productId, size, qty) => {
        if (qty < 1) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, qty: Math.min(12, qty) }
              : item,
          ),
        }));
      },
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => {
          const product = getProductById(item.productId);
          return sum + (product ? product.price * item.qty : 0);
        }, 0),
    }),
    {
      name: "nabil-socks-cart",
      version: 2,
      partialize: (state) => ({ items: state.items }),
      migrate: (persisted) => {
        const state = persisted as { items?: CartItem[] };
        return {
          items: (state.items ?? []).filter((item) => isSockSize(item.size)),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export type LastOrder = {
  id: string;
  email: string;
  city: string;
  items: CartItem[];
  total: number;
  placedAt: string;
};

export const LAST_ORDER_KEY = "nabil-socks-last-order";
