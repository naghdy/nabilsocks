"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/products";
import { LAST_ORDER_KEY, type LastOrder } from "@/lib/store";

function subscribe() {
  return () => {};
}

function getOrderSnapshot() {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

export function SuccessPanel() {
  const params = useSearchParams();
  const raw = useSyncExternalStore(subscribe, getOrderSnapshot, () => null);
  let order: LastOrder | null = null;
  if (raw) {
    try {
      order = JSON.parse(raw) as LastOrder;
    } catch {
      order = null;
    }
  }

  const id = params.get("id") ?? order?.id ?? "NS-DEMO";

  return (
    <div className="glass mx-auto max-w-xl rounded-3xl px-6 py-12 text-center">
      <p className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
        Transmission complete
      </p>
      <h1 className="font-display mt-3 text-4xl">Order staged.</h1>
      <p className="mt-3 text-sm text-muted">
        Demo only — no charge, no shipment, no card captured, no live Printful
        order. Keep the number as a souvenir.
      </p>
      <p className="font-display mt-8 text-3xl text-cyan">{id}</p>
      {order ? (
        <div className="mt-6 space-y-2 text-left text-sm text-muted">
          <p>
            Routed toward {order.city} · {order.email}
          </p>
          <ul className="space-y-1">
            {order.items.map((item) => {
              const product = getProductById(item.productId);
              return (
                <li key={`${item.productId}-${item.size}`}>
                  {product?.name ?? item.productId} · {item.size} × {item.qty}
                </li>
              );
            })}
          </ul>
          <p className="text-cyan">{formatPrice(order.total)} · not charged</p>
        </div>
      ) : null}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="rounded-full bg-cyan px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-black uppercase"
        >
          Return to shop
        </Link>
        <Link
          href="/agent"
          className="rounded-full border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase"
        >
          Ask Nabil again
        </Link>
      </div>
    </div>
  );
}
