import { NextResponse } from "next/server";
import { SHIPPING_COUNTRIES } from "@/lib/currency";
import {
  CheckoutError,
  encodeCartMetadata,
  parseCartLines,
  resolveCartLines,
  stripeLineItems,
} from "@/lib/checkout";
import {
  isPrintifyConfigured,
  isStripeConfigured,
  isStripeLiveMode,
  missingStripeMessage,
} from "@/lib/env";
import { isPrintifyMappingComplete } from "@/lib/printify-map";
import { products } from "@/lib/products";
import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function printifyReady() {
  return (
    isPrintifyConfigured() &&
    isPrintifyMappingComplete(products.map((product) => product.slug))
  );
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: missingStripeMessage() },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: missingStripeMessage() },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  let lines;
  try {
    lines = resolveCartLines(parseCartLines(record.items));
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  if (isStripeLiveMode() && !printifyReady()) {
    return NextResponse.json(
      {
        error:
          "Live Stripe charges are blocked until Printify credentials and product/variant IDs are filled. Use a test key or complete lib/printify-map.json.",
      },
      { status: 503 },
    );
  }

  const siteUrl = getSiteUrl(request);
  const cart = encodeCartMetadata(lines);
  const email =
    typeof record.email === "string" && record.email.includes("@")
      ? record.email.trim()
      : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: [...SHIPPING_COUNTRIES],
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?canceled=1`,
      line_items: stripeLineItems(lines),
      metadata: { cart },
      payment_intent_data: {
        metadata: { cart },
        description: "Nabil Socks",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      id: session.id,
      url: session.url,
      printifyReady: printifyReady(),
    });
  } catch (error) {
    console.error("Stripe Checkout Session create failed.", error);
    const message =
      error instanceof Error ? error.message : "Could not start Stripe Checkout.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
