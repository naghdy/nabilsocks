import { STORE_CURRENCY } from "./currency";

export function formatPrice(amount: number, currency = STORE_CURRENCY) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStripeTotal(
  amountTotal: number | null | undefined,
  currency: string | null | undefined,
) {
  if (amountTotal == null || !currency) return null;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountTotal / 100);
}
