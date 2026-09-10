"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { getProductById } from "@/lib/products";
import { formatPrice, generateOrderId } from "@/lib/format";
import { LAST_ORDER_KEY, useCartStore, type LastOrder } from "@/lib/store";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const clear = useCartStore((s) => s.clear);
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

  if (!hydrated) {
    return <p className="text-sm text-muted">Preparing checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl">Nothing to transmit.</h2>
        <p className="mt-2 text-sm text-muted">Add a pair before opening the demo gate.</p>
      </div>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["email", "name", "address", "city", "card", "expiry", "cvc"];
    const missing = required.some((key) => !String(data.get(key) ?? "").trim());
    if (missing) {
      setError("Fill every field. Nothing is charged — this is still a rehearsal.");
      return;
    }
    setError("");
    setSubmitting(true);
    const order: LastOrder = {
      id: generateOrderId(),
      email: String(data.get("email")),
      city: String(data.get("city")),
      items,
      total: subtotal,
      placedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    clear();
    router.push(`/checkout/success?id=${order.id}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={() => setError("")}
      className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="glass space-y-5 rounded-3xl p-5 sm:p-6">
        <p className="rounded-2xl border border-magenta/30 bg-magenta/8 px-4 py-3 text-sm">
          Demo checkout — no charge. Cards are not processed, stored, or sent anywhere.
        </p>
        <fieldset className="space-y-3">
          <legend className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
            Contact
          </legend>
          <Field name="email" label="Email" type="email" placeholder="you@nabilsocks.com" />
          <Field name="name" label="Full name" placeholder="Nabil Vale" />
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
            Shipping
          </legend>
          <Field name="address" label="Address" placeholder="88 Circuit Avenue" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="city" label="City" placeholder="Nightport" />
            <Field name="zip" label="Postal code" placeholder="10011" />
          </div>
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
            Payment theater
          </legend>
          <Field name="card" label="Card number" placeholder="4242 4242 4242 4242" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="expiry" label="Expiry" placeholder="12 / 29" />
            <Field name="cvc" label="CVC" placeholder="123" />
          </div>
        </fieldset>
        {error ? (
          <p className="text-sm text-magenta" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-cyan px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-black uppercase disabled:opacity-60"
        >
          {submitting ? "Transmitting…" : "Place demo order"}
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
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-cyan/50"
      />
    </label>
  );
}
