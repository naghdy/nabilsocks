#!/usr/bin/env node
/**
 * Fill S/M/L variant ids from Printify product JSON.
 *
 * Usage:
 *   PRINTIFY_API_TOKEN=... npm run printify:dump-map
 *   PRINTIFY_API_TOKEN=... npm run printify:dump-map -- --write
 *
 * Hits GET /v1/shops/{shop_id}/products/{product_id}.json for each known
 * shop product id in lib/printify-map.json (shop 28967994 by default).
 * Expected blueprint size variant ids: S 66447, M 66448, L 66449.
 * Skips dashboard SKU strings (they are not Create Order variant_id).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SHOP_ID = "28967994";
const SIZES = ["S", "M", "L"];
const UNSAFE_SKU_DIGITS = 16;

const dir = dirname(fileURLToPath(import.meta.url));
const mapPath = join(dir, "../lib/printify-map.json");

function sizeFromVariantTitle(title) {
  const tokens = String(title || "")
    .split(/[\/|,]/)
    .map((part) => part.trim().toUpperCase());
  for (const size of SIZES) {
    if (tokens.includes(size) || String(title).trim().toUpperCase() === size) {
      return size;
    }
  }
  const match = String(title)
    .toUpperCase()
    .match(/\b(S|M|L)\b/);
  return match ? match[1] : null;
}

function asSafeVariantId(value) {
  const asString = String(value ?? "").trim();
  if (!/^\d+$/.test(asString) || asString.length >= UNSAFE_SKU_DIGITS) {
    return 0;
  }
  const n = Number(asString);
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}

async function getProduct(token, shopId, productId) {
  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      `GET /v1/shops/${shopId}/products/${productId}.json failed (${response.status}): ${await response.text()}`,
    );
  }
  return response.json();
}

async function main() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID || DEFAULT_SHOP_ID;
  if (!token) {
    console.error("Set PRINTIFY_API_TOKEN. Then this script GETs each product JSON for variant ids.");
    process.exit(1);
  }

  const map = JSON.parse(readFileSync(mapPath, "utf8"));
  const warnings = [];

  for (const [slug, entry] of Object.entries(map)) {
    const productId = entry.printifyProductId;
    if (!productId) {
      warnings.push(`${slug}: missing printifyProductId`);
      continue;
    }
    const product = await getProduct(token, shopId, productId);
    const variants = { S: 0, M: 0, L: 0 };
    for (const variant of product.variants || []) {
      const size = sizeFromVariantTitle(variant.title);
      if (!size) continue;
      const id = asSafeVariantId(variant.id);
      if (!id) {
        warnings.push(
          `${slug} ${size}: skipped id ${variant.id} (looks like a SKU, not an API variant_id)`,
        );
        continue;
      }
      variants[size] = id;
    }
    map[slug] = {
      printifyProductId: String(product.id || productId),
      variants,
    };
    if (!variants.S || !variants.M || !variants.L) {
      warnings.push(
        `${slug}: incomplete variants ${JSON.stringify(variants)} — inspect GET /v1/shops/${shopId}/products/${productId}.json`,
      );
    }
  }

  const json = `${JSON.stringify(map, null, 2)}\n`;
  process.stdout.write(json);
  if (warnings.length) {
    console.error("Warnings:");
    for (const warning of warnings) console.error(`  ${warning}`);
  }
  if (process.argv.includes("--write")) {
    writeFileSync(mapPath, json);
    console.error(`Wrote ${mapPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
