import "server-only";

import { STORE_CURRENCY_LABEL } from "./currency";
import {
  isPrintifyConfigured,
  isStripeConfigured,
  isStripeLiveMode,
} from "./env";
import type { CheckoutConfig } from "./checkout-types";
import { isPrintifyMappingComplete } from "./printify-map";
import { products } from "./products";

export type { CheckoutConfig } from "./checkout-types";

export function getCheckoutConfig(): CheckoutConfig {
  const printifyMapped = isPrintifyMappingComplete(
    products.map((product) => product.slug),
  );
  const printifyConfigured = isPrintifyConfigured();
  return {
    stripeConfigured: isStripeConfigured(),
    stripeLive: isStripeLiveMode(),
    printifyConfigured,
    printifyMapped,
    printifyReady: printifyConfigured && printifyMapped,
    currency: STORE_CURRENCY_LABEL,
  };
}
