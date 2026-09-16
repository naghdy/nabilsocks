import type { Metadata } from "next";
import { SuccessPanel } from "@/components/SuccessPanel";
import { loadOrderConfirmation } from "@/lib/order-confirmation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Stripe payment confirmation for Nabil Socks.",
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const confirmation = await loadOrderConfirmation(session_id);

  return (
    <div className="px-4 py-16 sm:px-6">
      <SuccessPanel confirmation={confirmation} />
    </div>
  );
}
