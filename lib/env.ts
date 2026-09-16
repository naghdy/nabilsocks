import "server-only";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function isStripeLiveMode() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim().startsWith("sk_live_"));
}

export function isStripeWebhookConfigured() {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
}

export function isPrintifyConfigured() {
  return Boolean(
    process.env.PRINTIFY_API_TOKEN?.trim() && process.env.PRINTIFY_SHOP_ID?.trim(),
  );
}

export function missingStripeMessage() {
  return "Stripe is not configured. Set STRIPE_SECRET_KEY (and STRIPE_WEBHOOK_SECRET for fulfillment) in the environment. See .env.example.";
}

export function missingPrintifyMessage() {
  return "Printify is not configured. Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID. See .env.example.";
}
