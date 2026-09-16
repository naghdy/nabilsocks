export type SockHeight = "crew";

export type Material = "nylon-blend" | "printful-sublimation";

export type SockSize = "M" | "L" | "XL";

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

export type PrintfulMeta = {
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
  printful?: PrintfulMeta;
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

/** Printful catalog product 186 — Black Foot Sublimated Socks. */
export const PRINTFUL_SOCKS: PrintfulMeta = {
  productId: 186,
  technique: "sublimation",
  baseModel: "Black Foot Sublimated Socks",
};

export const PRINTFUL_CATALOG_URL =
  "https://www.printful.com/custom/socks/personalized/black-foot-sublimated-socks";

export const MATERIAL_COMPOSITION = "60% nylon / 22% cotton / 18% spandex";

export const MATERIAL_LABEL: Record<Material, string> = {
  "nylon-blend": MATERIAL_COMPOSITION,
  "printful-sublimation": MATERIAL_COMPOSITION,
};

export const CARE_COPY =
  "Machine wash ≤30°C with like colors. Do not bleach. Do not dry clean.";

export const FULFILLMENT_COPY =
  "Print-on-demand via Printful. Typical fulfill is about 2–5 business days, then shipping.";

export const BLANK_ORIGIN_COPY =
  "Blanks are sourced from China, then printed to order.";

export const SIZES: SockSize[] = ["M", "L", "XL"];

export const SIZE_GUIDE: Record<SockSize, string> = {
  M: "US men 7–8 / US women 9–10 / EU 39–41 / UK 6–8",
  L: "US men 9–12 / US women 10–13 / EU 42–46 / UK 8–11",
  XL: "US men 12–15 / US women 14–17 / EU 46–49 / UK 12–15",
};

export const SIZE_CHART: Record<
  SockSize,
  { usMen: string; usWomen: string; eu: string; uk: string }
> = {
  M: { usMen: "7–8", usWomen: "9–10", eu: "39–41", uk: "6–8" },
  L: { usMen: "9–12", usWomen: "10–13", eu: "42–46", uk: "8–11" },
  XL: { usMen: "12–15", usWomen: "14–17", eu: "46–49", uk: "12–15" },
};

export function isSockSize(value: unknown): value is SockSize {
  return value === "M" || value === "L" || value === "XL";
}
