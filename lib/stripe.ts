import "server-only";

import Stripe from "stripe";

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  cached = key ? new Stripe(key) : null;
  return cached;
}

export function requireStripe(): Stripe {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return stripe;
}
