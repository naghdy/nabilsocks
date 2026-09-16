"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CheckoutConfig } from "@/lib/checkout-types";
import { formatPrice } from "@/lib/format";
import { getProductById } from "@/lib/products";
import { useCartStore } from "@/lib/store";

export function CheckoutForm({
  config,
  canceled,
}: {
  config: CheckoutConfig;
  canceled: boolean;
}) {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product ? product.price * item.qty : 0);
      }, 0),
    [items],
  );

  const liveBlocked = config.stripeLive && !config.printifyReady;
  const canPay = config.stripeConfigured && !liveBlocked && items.length > 0;

  if (!hydrated) {
    return <p className="text-sm text-muted">Preparing checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl">Nothing to transmit.</h2>
        <p className="mt-2 text-sm text-muted">Add a pair before opening checkout.</p>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPay) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            qty: item.qty,
          })),
        }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setError(payload.error || "Could not start Stripe Checkout.");
        setSubmitting(false);
        return;
      }
      window.location.assign(payload.url);
    } catch {
      setError("Network error starting Stripe Checkout. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={() => setError("")}
      className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="glass space-y-5 rounded-3xl p-5 sm:p-6">
        {canceled ? (
          <p className="rounded-2xl border border-magenta/30 bg-magenta/8 px-4 py-3 text-sm" role="status">
            Stripe Checkout was canceled. Your bag is still here.
          </p>
        ) : null}
        {!config.stripeConfigured ? (
          <p className="rounded-2xl border border-magenta/30 bg-magenta/8 px-4 py-3 text-sm" role="alert">
            Stripe is not configured. Set <code className="font-mono text-cyan">STRIPE_SECRET_KEY</code> in
            the environment (see <code className="font-mono text-cyan">.env.example</code>). Checkout
            cannot start until the secret key is present.
          </p>
        ) : liveBlocked ? (
          <p className="rounded-2xl border border-magenta/30 bg-magenta/8 px-4 py-3 text-sm" role="alert">
            Live Stripe keys are set, but Printify is not ready. Fill{" "}
            <code className="font-mono text-cyan">PRINTIFY_API_TOKEN</code>,{" "}
            <code className="font-mono text-cyan">PRINTIFY_SHOP_ID</code>, and{" "}
            <code className="font-mono text-cyan">lib/printify-map.json</code> before taking live
            payments.
          </p>
        ) : (
          <p className="rounded-2xl border border-cyan/25 bg-cyan/8 px-4 py-3 text-sm">
            Pay with Stripe ({config.currency}). Shipping address is collected on the Stripe
            page and sent to Printify after payment. Card details never touch this site.
            {!config.printifyReady
              ? " Printify mapping is incomplete — test payments will succeed, but fulfillment stays on hold until product IDs are filled."
              : " Paid orders create a Printify job for Sublimation Crew Socks (EU)."}
          </p>
        )}
        <fieldset className="space-y-3">
          <legend className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
            Contact
          </legend>
          <label className="block">
            <span className="text-xs text-muted">Email (optional, prefills Stripe)</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@nabilsocks.com"
              className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-cyan/50"
            />
          </label>
        </fieldset>
        {error ? (
          <p className="text-sm text-magenta" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !canPay}
          className="w-full rounded-full bg-cyan px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-black uppercase disabled:opacity-60"
        >
          {submitting ? "Opening Stripe…" : "Pay with Stripe"}
        </button>
      </div>

      <aside className="glass h-fit rounded-3xl p-5 sm:p-6">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Bag</p>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <li key={`${item.productId}-${item.size}`} className="flex justify-between gap-3">
                <span>
                  {product.name} · {item.size} × {item.qty}
                </span>
                <span className="font-mono text-cyan">
                  {formatPrice(product.price * item.qty)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex justify-between border-t border-white/8 pt-4">
          <span className="text-muted">Total</span>
          <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-3 text-xs text-muted">
          Prices in {config.currency}. Production shipping is billed to Nabil Socks via Printify
          (Halle, Germany).
        </p>
      </aside>
    </form>
  );
}
