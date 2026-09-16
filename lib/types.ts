export type SockHeight = "crew";

export type Material = "poly-cotton-blend" | "printify-sublimation";

export type SockSize = "S" | "M" | "L";

export type SockPattern =
  | "circuit"
  | "pulse"
  | "flare"
  | "void"
  | "glacier"
  | "chromatic"
  | "glitch"
  | "ember"
  | "quiet"
  | "orbit";

export type PrintifyMeta = {
  productId: number;
  technique: "sublimation";
  baseModel: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  height: SockHeight;
  material: Material;
  colors: string[];
  vibe: string[];
  occasion: string[];
  limited?: boolean;
  aliases?: string[];
  printify?: PrintifyMeta;
  art: {
    pattern: SockPattern;
    primary: string;
    secondary: string;
    accent: string;
  };
};

export type CartItem = {
  productId: string;
  size: SockSize;
  qty: number;
};

/** Printify catalog product 496 — Sublimation Crew Socks (EU), Textildruck Europa. */
export const PRINTIFY_SOCKS: PrintifyMeta = {
  productId: 496,
  technique: "sublimation",
  baseModel: "Sublimation Crew Socks (EU)",
};

export const PRINTIFY_CATALOG_URL =
  "https://printify.com/app/products/496/generic-brand/sublimation-crew-socks-eu";

export const PRINTIFY_PROVIDER = "Textildruck Europa (Halle, Germany)";

export const MATERIAL_COMPOSITION = "70% polyester / 25% cotton / 5% spandex";

export const MATERIAL_LABEL: Record<Material, string> = {
  "poly-cotton-blend": MATERIAL_COMPOSITION,
  "printify-sublimation": MATERIAL_COMPOSITION,
};

export const CARE_COPY =
  "Machine wash inside out ≤30°C / 90°F with like colors. Do not bleach. Do not dry clean. Avoid ironing.";

export const FULFILLMENT_COPY =
  "Print-on-demand via Printify. Produced in Halle, Germany (Textildruck Europa). Typical production is 2–7 business days, then shipping from the EU — including to Switzerland.";

export const BLANK_ORIGIN_COPY =
  "EU production, no minimum order. Polyester exterior for dye sublimation, cotton interior for next-to-skin comfort. Heel tip and toe tip remain black.";

export const SIZES: SockSize[] = ["S", "M", "L"];

/**
 * Official Printify size chart for product 496 (Sublimation Crew Socks EU).
 * US men / US women / EU from Printify. UK derived as US men − 1
 * (Printify does not publish UK for this SKU). Length/width also from Printify.
 */
export const SIZE_GUIDE: Record<SockSize, string> = {
  S: "US men 3–5 / US women 4–6 / EU 35–38 / UK 2–4",
  M: "US men 6–10 / US women 7–10 / EU 38–41 / UK 5–9",
  L: "US men 10–13 / US women 11–14 / EU 41–45 / UK 9–12",
};

export const SIZE_CHART: Record<
  SockSize,
  { usMen: string; usWomen: string; eu: string; uk: string; lengthIn: string; widthIn: string }
> = {
  S: {
    usMen: "3–5",
    usWomen: "4–6",
    eu: "35–38",
    uk: "2–4",
    lengthIn: "14.17",
    widthIn: "3.94",
  },
  M: {
    usMen: "6–10",
    usWomen: "7–10",
    eu: "38–41",
    uk: "5–9",
    lengthIn: "17.32",
    widthIn: "3.94",
  },
  L: {
    usMen: "10–13",
    usWomen: "11–14",
    eu: "41–45",
    uk: "9–12",
    lengthIn: "18.50",
    widthIn: "3.94",
  },
};

export function isSockSize(value: unknown): value is SockSize {
  return value === "S" || value === "M" || value === "L";
}
