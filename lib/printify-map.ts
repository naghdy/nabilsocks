/**
 * Site `product.slug` + size → Printify shop `product_id` + `variant_id`.
 *
 * Shop (non-secret): 28967994
 * Catalog blueprint 496 (Sublimation Crew Socks EU / Textildruck Europa) is NOT
 * a shop product id. Each draft in Printify → My products has its own hex id.
 *
 * Product ids (wired from Printify My products):
 *   Circuit Crew      6aaae248d5714b7cbd0daaf6
 *   Pulse Crew        6aaae716d178a7928f075f2f
 *   Solar Flare       6aaae80171c86c01df0e6ea5
 *   Void Walker       6aaae9ab5ca74edf1b082bce
 *   Glacier Crew      6aaaea625ca74edf1b082c1b
 *   Chromatic Drift   6aaaeaee612292acda003ea4
 *   Signal Noise      6aaaeb964ba9c49749037e4d
 *   Ember Thread      6aaaec572ccc997f670732d8
 *   Quiet Protocol    6aaaecfc0801ed5d40076aa6
 *   Orbit Stripe      6aaaedb943a8179bdc0a7a88
 *
 * TODO — variant ids (S/M/L) are still 0. Fill from the Printify API once
 * PRINTIFY_API_TOKEN is in the environment (local or Vercel):
 *
 *   GET /v1/shops/28967994/products/{product_id}.json
 *
 * Use `variants[].id` where the title is S, M, or L. Those ids are small
 * integers (safe JS numbers). Then either:
 *   - paste them into `lib/printify-map.json`, or
 *   - run `npm run printify:dump-map -- --write`
 *
 * Do NOT use Printify dashboard SKU strings as variant_id. Orbit Stripe UI
 * SKUs (unverified, likely not API variant ids):
 *   S 13157926986216562450
 *   M 31981798884390687008
 *   L 50380363104639054382
 * Those values exceed Number.MAX_SAFE_INTEGER and must be confirmed against
 * the GET response before use.
 */

import type { Product } from "./types";
import type { SockSize } from "./types";
import fileMap from "./printify-map.json";

/** Printify shop that holds the ten Sublimation Crew Socks (EU) drafts. */
export const PRINTIFY_SHOP_ID_DEFAULT = "28967994";

export type PrintifySizeVariants = Record<SockSize, number>;

export type PrintifyShopEntry = {
  printifyProductId: string;
  variants: PrintifySizeVariants;
};

export type PrintifyShopMap = Record<string, PrintifyShopEntry>;

const FILE_MAP = fileMap as PrintifyShopMap;

function parseEnvOverlay(): Partial<PrintifyShopMap> {
  const raw = process.env.PRINTIFY_MAP_JSON;
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.error("PRINTIFY_MAP_JSON must be a JSON object keyed by product slug.");
      return {};
    }
    return parsed as Partial<PrintifyShopMap>;
  } catch (error) {
    console.error("PRINTIFY_MAP_JSON is not valid JSON.", error);
    return {};
  }
}

function mergeMaps(base: PrintifyShopMap, overlay: Partial<PrintifyShopMap>): PrintifyShopMap {
  const merged: PrintifyShopMap = { ...base };
  for (const [slug, entry] of Object.entries(overlay)) {
    if (!entry) continue;
    const current = merged[slug];
    merged[slug] = {
      printifyProductId: entry.printifyProductId || current?.printifyProductId || "",
      variants: {
        S: entry.variants?.S || current?.variants.S || 0,
        M: entry.variants?.M || current?.variants.M || 0,
        L: entry.variants?.L || current?.variants.L || 0,
      },
    };
  }
  return merged;
}

export function getPrintifyShopMap(): PrintifyShopMap {
  return mergeMaps(FILE_MAP, parseEnvOverlay());
}

export function getPrintifyShopEntry(slug: string): PrintifyShopEntry | undefined {
  return getPrintifyShopMap()[slug];
}

export function isFilledShopEntry(entry: PrintifyShopEntry | undefined): entry is PrintifyShopEntry {
  if (!entry) return false;
  const id = entry.printifyProductId.trim();
  if (!id || id.startsWith("REPLACE")) return false;
  return entry.variants.S > 0 && entry.variants.M > 0 && entry.variants.L > 0;
}

export function isPrintifyMappingComplete(slugs: string[]): boolean {
  const map = getPrintifyShopMap();
  return slugs.every((slug) => isFilledShopEntry(map[slug]));
}

export type PrintifyLine = {
  product_id: string;
  variant_id: number;
  quantity: number;
};

export function resolvePrintifyLine(
  slug: string,
  size: SockSize,
  quantity: number,
): PrintifyLine | null {
  const entry = getPrintifyShopEntry(slug);
  if (!isFilledShopEntry(entry)) return null;
  const variant_id = entry.variants[size];
  if (!variant_id) return null;
  return {
    product_id: entry.printifyProductId.trim(),
    variant_id,
    quantity,
  };
}

export function attachPrintifyShopMapping(product: Product): Product {
  const entry = getPrintifyShopEntry(product.slug);
  if (!entry || !product.printify) return product;
  const shopProductId = entry.printifyProductId.trim();
  return {
    ...product,
    printify: {
      ...product.printify,
      shopProductId: shopProductId || undefined,
      variants: isFilledShopEntry(entry) ? entry.variants : undefined,
    },
  };
}
