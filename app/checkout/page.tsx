import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Demo checkout for Nabil Socks — no real payments.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">
        Demo gate
      </p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">Checkout</h1>
      <p className="mt-3 max-w-xl text-muted">
        Shipping and payment fields exist so the ritual feels complete. Submit
        and you get a souvenir order id — never a charge.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
