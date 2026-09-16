/**
 * Site `product.slug` + size → Printify shop `product_id` + `variant_id`.
 *
 * Catalog blueprint 496 (Sublimation Crew Socks EU / Textildruck Europa) is NOT
 * the shop product id. Each unpublished draft in Printify → My products has its
 * own hex `product_id`. Sizes S/M/L each have a numeric `variant_id`.
 *
 * How to fill
 * 1. Open Printify → My products → a draft (Circuit Crew, Pulse Crew, …).
 * 2. Copy the shop product id from the URL:
 *    `https://printify.com/app/products/{THIS_HEX_ID}`
 * 3. Open Variants. Copy the numeric variant id for S, M, and L.
 * 4. Paste into `lib/printify-map.json`, or set `PRINTIFY_MAP_JSON` to a JSON
 *    object of the same shape (useful on Vercel without a code change).
 * 5. Optional: `npm run printify:dump-map` with `PRINTIFY_API_TOKEN` and
 *    `PRINTIFY_SHOP_ID` prints a filled map (add `--write` to save the file).
 *
 * Empty product ids and variant `0` are placeholders and fail fulfillment.
 */

import type { Product } from "./types";
import type { SockSize } from "./types";
import fileMap from "./printify-map.json";

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
  return {
    ...product,
    printify: {
      ...product.printify,
      shopProductId: isFilledShopEntry(entry) ? entry.printifyProductId.trim() : undefined,
      variants: isFilledShopEntry(entry) ? entry.variants : undefined,
    },
  };
}
