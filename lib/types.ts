export type SockHeight = "no-show" | "ankle" | "crew" | "mid-calf" | "knee";

export type Material =
  | "merino"
  | "cashmere-silk"
  | "organic-cotton"
  | "bamboo"
  | "technical-mesh"
  | "recycled-poly";

export type SockSize = "S" | "M" | "L" | "XL";

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

export const SIZES: SockSize[] = ["S", "M", "L", "XL"];

export const SIZE_GUIDE: Record<SockSize, string> = {
  S: "US 4–6.5",
  M: "US 7–9",
  L: "US 9.5–11.5",
  XL: "US 12–14",
};
