"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { OrderConfirmation } from "@/lib/checkout-types";
import { useCartStore } from "@/lib/store";

export function SuccessPanel({ confirmation }: { confirmation: OrderConfirmation }) {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (confirmation.paid) {
      clear();
    }
  }, [clear, confirmation.paid]);

  const id = confirmation.sessionId ?? "session missing";

  return (
    <div className="glass mx-auto max-w-xl rounded-3xl px-6 py-12 text-center">
      <p className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
        Transmission complete
      </p>
      <h1 className="font-display mt-3 text-4xl">
        {confirmation.paid ? "Order confirmed." : "Checkout received."}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {confirmation.paid
          ? "Stripe captured payment. Printify fulfillment starts from this session — keep the id below."
          : "We could not fully confirm payment details yet."}
      </p>
      <p className="font-display mt-8 text-2xl text-cyan break-all">{id}</p>
      {confirmation.email || confirmation.city || confirmation.items.length ? (
        <div className="mt-6 space-y-2 text-left text-sm text-muted">
          {confirmation.email ? <p>Receipt → {confirmation.email}</p> : null}
          {confirmation.city ? (
            <p>
              Shipping toward {confirmation.city}
              {confirmation.country ? `, ${confirmation.country}` : ""}
            </p>
          ) : null}
          <ul className="space-y-1">
            {confirmation.items.map((item) => (
              <li key={`${item.name}-${item.size}`}>
                {item.name}
                {item.size ? ` · ${item.size}` : ""} × {item.qty}
              </li>
            ))}
          </ul>
          {confirmation.totalLabel ? (
            <p className="text-cyan">{confirmation.totalLabel} · charged</p>
          ) : null}
          {confirmation.printifyOrderId ? (
            <p className="font-mono text-[11px] tracking-[0.08em]">
              Printify {confirmation.printifyOrderId}
              {confirmation.printifyStatus ? ` · ${confirmation.printifyStatus}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}
      {confirmation.warning ? (
        <p className="mt-4 text-sm text-magenta" role="alert">
          {confirmation.warning}
        </p>
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
