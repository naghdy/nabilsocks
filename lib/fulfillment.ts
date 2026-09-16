import "server-only";

import type Stripe from "stripe";
import {
  decodeCartMetadata,
  resolveCartLines,
  type ResolvedCartLine,
} from "./checkout";
import {
  isPrintifyConfigured,
  isStripeLiveMode,
  missingPrintifyMessage,
} from "./env";
import {
  createPrintifyOrder,
  findPrintifyOrderByExternalId,
  getPrintifyCredentials,
  sendPrintifyOrderToProduction,
  type PrintifyAddress,
} from "./printify";
import { resolvePrintifyLine } from "./printify-map";
import { getStripe } from "./stripe";

const META_ORDER_ID = "printify_order_id";
const META_STATUS = "printify_status";
const META_CART = "cart";

export type FulfillmentResult = {
  status: string;
  printifyOrderId?: string;
  skipped?: boolean;
  retryable: boolean;
};

function splitName(fullName: string | null | undefined) {
  const trimmed = fullName?.trim() || "Customer";
  const parts = trimmed.split(/\s+/);
  const first_name = parts[0] || "Customer";
  const last_name = parts.slice(1).join(" ") || first_name;
  return { first_name, last_name };
}

function shippingFromSession(session: Stripe.Checkout.Session) {
  const collected = session.collected_information?.shipping_details;
  const legacy = (
    session as Stripe.Checkout.Session & {
      shipping_details?: Stripe.Checkout.Session.CollectedInformation.ShippingDetails | null;
    }
  ).shipping_details;
  return collected ?? legacy ?? null;
}

function addressFromSession(session: Stripe.Checkout.Session): PrintifyAddress {
  const shipping = shippingFromSession(session);
  const address = shipping?.address;
  const email =
    session.customer_details?.email || session.customer_email || "";
  const phone = session.customer_details?.phone || "";
  const { first_name, last_name } = splitName(
    shipping?.name || session.customer_details?.name,
  );

  if (!address?.country || !address.line1 || !address.city || !address.postal_code) {
    throw new Error("Stripe session is missing a complete shipping address.");
  }
  if (!email) {
    throw new Error("Stripe session is missing a customer email.");
  }

  return {
    first_name,
    last_name,
    email,
    phone: phone || "0000000000",
    country: address.country,
    region: address.state || "",
    address1: address.line1,
    address2: address.line2 || "",
    city: address.city,
    zip: address.postal_code,
  };
}

function linesFromSession(session: Stripe.Checkout.Session): ResolvedCartLine[] {
  return resolveCartLines(decodeCartMetadata(session.metadata?.[META_CART]));
}

function shouldSendToProduction(livemode: boolean) {
  const flag = process.env.PRINTIFY_SEND_TO_PRODUCTION?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;
  return livemode;
}

async function rememberFulfillment(
  session: Stripe.Checkout.Session,
  patch: Record<string, string>,
) {
  const stripe = getStripe();
  if (!stripe) return;
  const metadata = { ...session.metadata, ...patch };
  try {
    await stripe.checkout.sessions.update(session.id, { metadata });
    session.metadata = metadata;
  } catch (error) {
    console.error("Failed to persist Printify ids on Stripe session.", error);
  }
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (paymentIntent) {
    try {
      await stripe.paymentIntents.update(paymentIntent, { metadata });
    } catch (error) {
      console.error("Failed to persist Printify ids on PaymentIntent.", error);
    }
  }
}

export async function fulfillPaidCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<FulfillmentResult> {
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return { status: "unpaid", skipped: true, retryable: false };
  }

  const existingId = session.metadata?.[META_ORDER_ID];
  const existingStatus = session.metadata?.[META_STATUS];
  if (existingStatus === "submitted" && existingId) {
    return {
      status: "already_submitted",
      printifyOrderId: existingId,
      skipped: true,
      retryable: false,
    };
  }

  if (!isPrintifyConfigured() || !getPrintifyCredentials()) {
    console.error(missingPrintifyMessage());
    await rememberFulfillment(session, { [META_STATUS]: "unconfigured" });
    return { status: "unconfigured", skipped: true, retryable: false };
  }

  let lines: ResolvedCartLine[];
  try {
    lines = linesFromSession(session);
  } catch (error) {
    console.error("Could not decode paid cart metadata.", error);
    await rememberFulfillment(session, { [META_STATUS]: "invalid_cart" });
    return { status: "invalid_cart", skipped: true, retryable: false };
  }

  const printifyLines = [];
  for (const line of lines) {
    const mapped = resolvePrintifyLine(line.slug, line.size, line.qty);
    if (!mapped) {
      console.error(
        `Printify map missing for ${line.slug} size ${line.size}. Fill lib/printify-map.json.`,
      );
      await rememberFulfillment(session, { [META_STATUS]: "unmapped" });
      return { status: "unmapped", skipped: true, retryable: false };
    }
    printifyLines.push({
      ...mapped,
      external_id: `${session.id}:${line.slug}:${line.size}`,
    });
  }

  let printifyOrderId = existingId || undefined;
  if (!printifyOrderId) {
    const already = await findPrintifyOrderByExternalId(session.id);
    printifyOrderId = already?.id;
  }

  if (!printifyOrderId) {
    try {
      const created = await createPrintifyOrder({
        external_id: session.id,
        label: session.id,
        line_items: printifyLines,
        address_to: addressFromSession(session),
      });
      printifyOrderId = created.id;
    } catch (error) {
      const already = await findPrintifyOrderByExternalId(session.id);
      if (already?.id) {
        printifyOrderId = already.id;
      } else {
        throw error;
      }
    }
    if (!printifyOrderId) {
      throw new Error("Printify did not return an order id.");
    }
    await rememberFulfillment(session, {
      [META_ORDER_ID]: printifyOrderId,
      [META_STATUS]: "created",
    });
  }

  if (!shouldSendToProduction(session.livemode ?? isStripeLiveMode())) {
    await rememberFulfillment(session, {
      [META_ORDER_ID]: printifyOrderId,
      [META_STATUS]: "created_hold",
    });
    return {
      status: "created_hold",
      printifyOrderId,
      retryable: false,
    };
  }

  await sendPrintifyOrderToProduction(printifyOrderId);
  await rememberFulfillment(session, {
    [META_ORDER_ID]: printifyOrderId,
    [META_STATUS]: "submitted",
  });
  return {
    status: "submitted",
    printifyOrderId,
    retryable: false,
  };
}

export async function fulfillCheckoutSessionById(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) {
    return { status: "stripe_unconfigured", skipped: true, retryable: false };
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return fulfillPaidCheckoutSession(session);
}

export async function fulfillPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  const stripe = getStripe();
  if (!stripe) {
    return { status: "stripe_unconfigured", skipped: true, retryable: false };
  }
  if (paymentIntent.status !== "succeeded") {
    return { status: "not_succeeded", skipped: true, retryable: false };
  }
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });
  const session = sessions.data[0];
  if (!session) {
    console.error(`No Checkout Session found for PaymentIntent ${paymentIntent.id}`);
    return { status: "no_session", skipped: true, retryable: false };
  }
  const full = await stripe.checkout.sessions.retrieve(session.id);
  return fulfillPaidCheckoutSession(full);
}
