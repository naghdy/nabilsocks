/** Checkout and catalog currency. CHF matches the Swiss brand (nabilsocks.com). */
export const STORE_CURRENCY = "chf" as const;

export const STORE_CURRENCY_LABEL = "CHF";

/** Stripe / ISO minor units (Rappen). Catalog prices are whole CHF. */
export const CURRENCY_MINOR_UNITS = 100;

export const SHIPPING_COUNTRIES = [
  "CH",
  "LI",
  "DE",
  "AT",
  "FR",
  "IT",
  "BE",
  "NL",
  "LU",
  "ES",
  "PT",
  "IE",
  "PL",
  "CZ",
  "SK",
  "SI",
  "HR",
  "HU",
  "DK",
  "SE",
  "FI",
  "NO",
  "GB",
  "US",
  "CA",
] as const;
