import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isStripeWebhookConfigured, missingStripeMessage } from "@/lib/env";
import {
  fulfillPaidCheckoutSession,
  fulfillPaymentIntent,
} from "@/lib/fulfillment";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    console.error(missingStripeMessage());
    return NextResponse.json({ error: missingStripeMessage() }, { status: 503 });
  }
  if (!isStripeWebhookConfigured()) {
    const message =
      "STRIPE_WEBHOOK_SECRET is not set. Refusing to process unsigned webhooks.";
    console.error(message);
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("Stripe webhook signature verification failed.", message);
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await fulfillPaidCheckoutSession(
        await stripe.checkout.sessions.retrieve(session.id),
      );
      if (result.retryable) {
        return NextResponse.json({ received: true, ...result }, { status: 500 });
      }
      return NextResponse.json({ received: true, ...result });
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const result = await fulfillPaymentIntent(paymentIntent);
      if (result.retryable) {
        return NextResponse.json({ received: true, ...result }, { status: 500 });
      }
      return NextResponse.json({ received: true, ...result });
    }

    return NextResponse.json({ received: true, ignored: event.type });
  } catch (error) {
    console.error(`Fulfillment failed for ${event.type}.`, error);
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : "Fulfillment failed",
      },
      { status: 500 },
    );
  }
}
