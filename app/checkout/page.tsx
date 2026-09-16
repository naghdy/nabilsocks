import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getCheckoutConfig } from "@/lib/checkout-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay with Stripe for Nabil Socks — Printify EU fulfillment.",
};

type Props = {
  searchParams: Promise<{ canceled?: string }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const { canceled } = await searchParams;
  const config = getCheckoutConfig();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">
        Stripe gate
      </p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">Checkout</h1>
      <p className="mt-3 max-w-xl text-muted">
        Pay with Stripe in {config.currency}. Shipping is collected on the Stripe
        page, then a paid webhook creates the Printify order for Sublimation Crew
        Socks (EU).
      </p>
      <div className="mt-8">
        <CheckoutForm config={config} canceled={canceled === "1"} />
      </div>
    </div>
  );
}
