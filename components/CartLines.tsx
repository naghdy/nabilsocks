"use client";

import Link from "next/link";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store";
import { SockPhoto } from "@/components/SockPhoto";
import { SIZE_GUIDE, isSockSize } from "@/lib/types";

export function CartLines() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product ? product.price * item.qty : 0);
    }, 0),
  );

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading bag…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-16 text-center">
        <p className="font-mono text-[10px] tracking-[0.24em] text-cyan uppercase">Empty protocol</p>
        <h2 className="font-display mt-3 text-3xl">The bag is silent.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Ask Nabil for a pair, or walk the grid yourself.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/agent"
            className="rounded-full bg-cyan px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-black uppercase"
          >
            Talk to Nabil
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase"
          >
            Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return (
            <li
              key={`${item.productId}-${item.size}`}
              className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
            >
              <Link href={`/product/${product.slug}`} className="flex items-center gap-4">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-black/30">
                  <SockPhoto product={product} sizes="80px" />
                </div>
                <div>
                  <p className="font-display text-lg">{product.name}</p>
                  <p className="text-sm text-muted">
                    Size {item.size}
                    {isSockSize(item.size) ? ` · ${SIZE_GUIDE[item.size]}` : " · unavailable size"}
                  </p>
                  <p className="font-mono text-sm text-cyan">{formatPrice(product.price)}</p>
                </div>
              </Link>
              <div className="flex flex-1 items-center justify-between gap-3 sm:justify-end">
                <div className="inline-flex items-center rounded-full border border-white/12">
                  <button
                    type="button"
                    className="px-3 py-1.5"
                    aria-label={`Decrease ${product.name}`}
                    onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center font-mono text-sm">{item.qty}</span>
                  <button
                    type="button"
                    className="px-3 py-1.5"
                    aria-label={`Increase ${product.name}`}
                    onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase hover:text-magenta"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="glass flex flex-col items-start justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Subtotal</p>
          <p className="font-display text-3xl">{formatPrice(subtotal)}</p>
          <p className="text-xs text-muted">
            Demo shipping is listed as complimentary. Live Printify EU production
            is typically 2–7 business days, then shipping.
          </p>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-cyan px-6 py-3 font-mono text-[11px] tracking-[0.18em] text-black uppercase"
        >
          Demo checkout
        </Link>
      </div>
    </div>
  );
}
