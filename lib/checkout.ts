import "server-only";

import { CURRENCY_MINOR_UNITS, STORE_CURRENCY } from "./currency";
import { getProduct, getProductById } from "./products";
import { isSockSize, type SockSize } from "./types";

export class CheckoutError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

export type CartLineInput = {
  productId?: string;
  slug?: string;
  size: string;
  qty: number;
};

export type ResolvedCartLine = {
  productId: string;
  slug: string;
  name: string;
  size: SockSize;
  qty: number;
  unitAmount: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function parseCartLines(input: unknown): CartLineInput[] {
  if (!Array.isArray(input)) {
    throw new CheckoutError("Cart items must be an array.");
  }
  return input.map((entry, index) => {
    const record = asRecord(entry);
    if (!record) {
      throw new CheckoutError(`Cart item ${index + 1} is invalid.`);
    }
    const size = String(record.size ?? "");
    const qty = Number(record.qty ?? record.quantity ?? 0);
    return {
      productId: typeof record.productId === "string" ? record.productId : undefined,
      slug: typeof record.slug === "string" ? record.slug : undefined,
      size,
      qty,
    };
  });
}

export function resolveCartLines(input: CartLineInput[]): ResolvedCartLine[] {
  if (input.length === 0) {
    throw new CheckoutError("Cart is empty.");
  }
  if (input.length > 20) {
    throw new CheckoutError("Cart is too large.");
  }

  return input.map((item, index) => {
    const product = item.productId
      ? getProductById(item.productId)
      : item.slug
        ? getProduct(item.slug)
        : undefined;
    if (!product) {
      throw new CheckoutError(`Unknown product in cart item ${index + 1}.`);
    }
    if (!isSockSize(item.size)) {
      throw new CheckoutError(`${product.name} needs size S, M, or L.`);
    }
    const qty = Math.floor(item.qty);
    if (!Number.isFinite(qty) || qty < 1 || qty > 12) {
      throw new CheckoutError(`Invalid quantity for ${product.name}.`);
    }
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: item.size,
      qty,
      unitAmount: Math.round(product.price * CURRENCY_MINOR_UNITS),
    };
  });
}

export function encodeCartMetadata(lines: ResolvedCartLine[]) {
  return lines.map((line) => `${line.productId}:${line.size}:${line.qty}`).join("|");
}

export function decodeCartMetadata(raw: string | null | undefined): CartLineInput[] {
  if (!raw?.trim()) return [];
  return raw.split("|").map((part) => {
    const [productId, size, qty] = part.split(":");
    return {
      productId,
      size: size ?? "",
      qty: Number(qty),
    };
  });
}

export function stripeLineItems(lines: ResolvedCartLine[]) {
  return lines.map((line) => ({
    quantity: line.qty,
    price_data: {
      currency: STORE_CURRENCY,
      unit_amount: line.unitAmount,
      product_data: {
        name: `${line.name} · ${line.size}`,
        description: "Printify Sublimation Crew Socks (EU)",
        metadata: {
          productId: line.productId,
          slug: line.slug,
          size: line.size,
        },
      },
    },
  }));
}
