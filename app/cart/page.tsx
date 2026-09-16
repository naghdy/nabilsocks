import type { Metadata } from "next";
import { CartLines } from "@/components/CartLines";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the Nabil Socks bag before a demo checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">Bag</p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">Your selection</h1>
      <p className="mt-3 text-muted">
        Update quantities, remove a pair, or continue to the demo gate. Sizes
        are S, M, and L — the Printify EU crew has no XL.
      </p>
      <div className="mt-8">
        <CartLines />
      </div>
    </div>
  );
}
