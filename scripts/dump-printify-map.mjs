#!/usr/bin/env node
/**
 * Dump Printify shop products into the nabilsocks slug → product/variant map.
 *
 * Usage:
 *   PRINTIFY_API_TOKEN=... PRINTIFY_SHOP_ID=... npm run printify:dump-map
 *   PRINTIFY_API_TOKEN=... PRINTIFY_SHOP_ID=... npm run printify:dump-map -- --write
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SLUG_BY_NAME = {
  "circuit crew": "circuit-crew",
  "pulse crew": "pulse-crew",
  "solar flare": "solar-flare",
  "void walker": "void-walker",
  "glacier crew": "glacier-crew",
  "chromatic drift": "chromatic-drift",
  "signal noise": "signal-noise",
  "ember thread": "ember-thread",
  "quiet protocol": "quiet-protocol",
  "orbit stripe": "orbit-stripe",
};

const SIZES = ["S", "M", "L"];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugForProduct(product) {
  const title = normalize(product.title);
  if (SLUG_BY_NAME[title]) return SLUG_BY_NAME[title];
  for (const [name, slug] of Object.entries(SLUG_BY_NAME)) {
    if (title.includes(name)) return slug;
  }
  return null;
}

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

async function listProducts(token, shopId) {
  const products = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json?limit=50&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Printify products list failed (${response.status}): ${await response.text()}`);
    }
    const body = await response.json();
    products.push(...(body.data || []));
    if (page >= (body.last_page || page)) break;
  }
  return products;
}

function buildMap(products) {
  const map = {};
  for (const slug of Object.values(SLUG_BY_NAME)) {
    map[slug] = { printifyProductId: "", variants: { S: 0, M: 0, L: 0 } };
  }
  for (const product of products) {
    const slug = slugForProduct(product);
    if (!slug) continue;
    const variants = { S: 0, M: 0, L: 0 };
    for (const variant of product.variants || []) {
      const size = sizeFromVariantTitle(variant.title);
      if (size && (variant.is_enabled !== false)) {
        variants[size] = Number(variant.id) || 0;
      }
    }
    map[slug] = {
      printifyProductId: String(product.id),
      variants,
    };
  }
  return map;
}

async function main() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopId) {
    console.error("Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID.");
    process.exit(1);
  }
  const products = await listProducts(token, shopId);
  const map = buildMap(products);
  const json = `${JSON.stringify(map, null, 2)}\n`;
  process.stdout.write(json);
  if (process.argv.includes("--write")) {
    const dir = dirname(fileURLToPath(import.meta.url));
    const target = join(dir, "../lib/printify-map.json");
    writeFileSync(target, json);
    console.error(`Wrote ${target}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
