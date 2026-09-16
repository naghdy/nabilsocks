import "server-only";

import { decodeCartMetadata, resolveCartLines } from "./checkout";
import type { OrderConfirmation } from "./checkout-types";
import { formatStripeTotal } from "./format";
import { getProductById } from "./products";
import { getStripe } from "./stripe";

export type { OrderConfirmation } from "./checkout-types";

function emptyConfirmation(sessionId: string | null, warning: string | null): OrderConfirmation {
  return {
    sessionId,
    paid: false,
    email: null,
    city: null,
    country: null,
    totalLabel: null,
    items: [],
    printifyStatus: null,
    printifyOrderId: null,
    warning,
  };
}

export async function loadOrderConfirmation(
  sessionId: string | undefined,
): Promise<OrderConfirmation> {
  if (!sessionId) {
    return emptyConfirmation(null, "Missing Stripe session id.");
  }

  const stripe = getStripe();
  if (!stripe) {
    return emptyConfirmation(
      sessionId,
      "Payment may have succeeded, but STRIPE_SECRET_KEY is not set on this deployment so order details cannot be loaded.",
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    const shipping =
      session.collected_information?.shipping_details ??
      (
        session as typeof session & {
          shipping_details?: { address?: { city?: string | null; country?: string | null } | null };
        }
      ).shipping_details;
    let items: OrderConfirmation["items"] = [];
    try {
      items = resolveCartLines(decodeCartMetadata(session.metadata?.cart)).map((line) => ({
        name: line.name,
        size: line.size,
        qty: line.qty,
      }));
    } catch {
      const lineItems = session.line_items?.data ?? [];
      items = lineItems.map((item) => ({
        name: item.description || "Nabil Socks",
        size: item.description?.match(/·\s*([SML])\b/)?.[1] ?? "",
        qty: item.quantity ?? 1,
      }));
    }

    if (items.length === 0) {
      items = decodeCartMetadata(session.metadata?.cart).map((line) => {
        const product = line.productId ? getProductById(line.productId) : undefined;
        return {
          name: product?.name ?? line.productId ?? "Pair",
          size: line.size,
          qty: line.qty,
        };
      });
    }

    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    return {
      sessionId: session.id,
      paid,
      email: session.customer_details?.email ?? session.customer_email ?? null,
      city: shipping?.address?.city ?? null,
      country: shipping?.address?.country ?? null,
      totalLabel: formatStripeTotal(session.amount_total, session.currency),
      items,
      printifyStatus: session.metadata?.printify_status ?? null,
      printifyOrderId: session.metadata?.printify_order_id ?? null,
      warning: paid
        ? null
        : "Stripe has not marked this session paid yet. Refresh in a moment.",
    };
  } catch (error) {
    console.error("Failed to load Stripe Checkout Session.", error);
    return emptyConfirmation(
      sessionId,
      "Could not load this Stripe session. Check the session id and STRIPE_SECRET_KEY.",
    );
  }
}
