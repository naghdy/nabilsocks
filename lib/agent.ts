import { products } from "./products";
import type { Product, SockSize } from "./types";

export type AgentAction =
  | { type: "none" }
  | { type: "add"; product: Product; size: SockSize }
  | { type: "navigate"; href: string };

export type AgentReply = {
  text: string;
  products: Product[];
  action: AgentAction;
};

const greetings = [
  "hello",
  "hi",
  "hey",
  "yo",
  "sup",
  "good morning",
  "good evening",
];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function scoreProduct(product: Product, query: string) {
  let score = 0;
  const hay = [
    product.name,
    product.tagline,
    product.description,
    product.height,
    product.material,
    ...product.colors,
    ...product.vibe,
    ...product.occasion,
    product.limited ? "limited drop exclusive" : "",
  ]
    .join(" ")
    .toLowerCase();

  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((token) => token.length > 2);

  for (const token of tokens) {
    if (hay.includes(token)) score += 3;
  }

  if (includesAny(query, ["run", "gym", "train", "sport", "athletic"])) {
    if (product.occasion.includes("run") || product.occasion.includes("gym"))
      score += 6;
    if (product.vibe.includes("athletic")) score += 4;
  }
  if (includesAny(query, ["work", "office", "board", "meeting", "formal"])) {
    if (product.occasion.includes("work") || product.occasion.includes("boardroom"))
      score += 8;
    if (product.vibe.includes("quiet") || product.vibe.includes("minimal"))
      score += 4;
  }
  if (includesAny(query, ["date", "night", "party", "club", "out"])) {
    if (product.occasion.includes("night") || product.occasion.includes("date"))
      score += 6;
  }
  if (includesAny(query, ["gift", "present"])) {
    if (product.occasion.includes("gift")) score += 4;
    if (product.limited) score += 3;
  }
  if (includesAny(query, ["ankle"])) {
    if (product.height === "ankle") score += 8;
  }
  if (includesAny(query, ["crew"])) {
    if (product.height === "crew") score += 8;
  }
  if (includesAny(query, ["knee", "tall"])) {
    if (product.height === "knee") score += 10;
  }
  if (includesAny(query, ["no-show", "noshow", "invisible", "hidden"])) {
    if (product.height === "no-show") score += 10;
  }
  if (includesAny(query, ["mid", "calf"])) {
    if (product.height === "mid-calf") score += 8;
  }
  if (includesAny(query, ["merino", "wool"])) {
    if (product.material === "merino") score += 7;
  }
  if (includesAny(query, ["cashmere", "silk", "luxury"])) {
    if (product.material === "cashmere-silk" || product.vibe.includes("luxury"))
      score += 7;
  }
  if (includesAny(query, ["bamboo"])) {
    if (product.material === "bamboo") score += 8;
  }
  if (includesAny(query, ["cotton"])) {
    if (product.material === "organic-cotton") score += 8;
  }
  if (includesAny(query, ["mesh", "technical"])) {
    if (product.material === "technical-mesh") score += 7;
  }
  if (includesAny(query, ["recycled", "sustainable"])) {
    if (product.material === "recycled-poly") score += 8;
  }
  if (includesAny(query, ["cyan", "blue", "electric", "ice", "glacier"])) {
    if (product.colors.some((c) => ["cyan", "blue", "ice", "electric"].includes(c)))
      score += 5;
  }
  if (includesAny(query, ["pink", "magenta", "pulse"])) {
    if (product.colors.includes("magenta")) score += 6;
  }
  if (includesAny(query, ["gold", "orange", "ember", "rust", "warm"])) {
    if (product.colors.some((c) => ["gold", "orange", "ember", "rust"].includes(c)))
      score += 6;
  }
  if (includesAny(query, ["purple", "violet", "void"])) {
    if (product.colors.some((c) => ["purple", "violet"].includes(c))) score += 6;
  }
  if (includesAny(query, ["black", "dark", "midnight"])) {
    if (product.colors.includes("black") || product.colors.includes("midnight"))
      score += 3;
  }
  if (includesAny(query, ["white", "cream", "quiet", "minimal", "stealth"])) {
    if (product.vibe.includes("quiet") || product.vibe.includes("minimal"))
      score += 6;
  }
  if (includesAny(query, ["glitch", "noise", "broken"])) {
    if (product.vibe.includes("glitch")) score += 10;
  }
  if (includesAny(query, ["limited", "drop", "exclusive", "rare"])) {
    if (product.limited) score += 8;
  }
  if (includesAny(query, ["cyber", "tech", "future", "circuit"])) {
    if (product.vibe.includes("tech") || product.vibe.includes("cyber")) score += 6;
  }

  return score;
}

function recommend(query: string, limit = 3) {
  const ranked = products
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .sort((a, b) => b.score - a.score);

  const positive = ranked.filter((entry) => entry.score > 0).slice(0, limit);
  if (positive.length > 0) return positive.map((entry) => entry.product);

  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

function findProductMention(query: string) {
  const lower = query.toLowerCase();
  return products.find((product) => {
    const tokens = product.name.toLowerCase().split(" ");
    return (
      lower.includes(product.slug.replace("-", " ")) ||
      lower.includes(product.name.toLowerCase()) ||
      tokens.every((token) => lower.includes(token))
    );
  });
}

function detectSize(query: string): SockSize {
  if (/\bxl\b/.test(query) || query.includes("extra large")) return "XL";
  if (/\bl\b/.test(query) || query.includes("large")) return "L";
  if (/\bs\b/.test(query) || query.includes("small")) return "S";
  return "M";
}

export const starterChips = [
  "Night out",
  "Boardroom",
  "I run",
  "Quiet luxury",
  "Limited drops",
  "Surprise me",
];

export function openingMessage() {
  return "I'm Nabil. I don't browse catalogs — I listen. Occasion, color, height, material, vibe. Give me any of those and I'll pull a pair from the grid. Or say add Circuit Crew if you already know.";
}

export function replyTo(raw: string): AgentReply {
  const text = raw.trim();
  const query = text.toLowerCase();

  if (!text) {
    return {
      text: "Silence is a vibe, but I need a signal. Try night out, merino, or surprise me.",
      products: [],
      action: { type: "none" },
    };
  }

  if (includesAny(query, ["checkout", "pay", "buy now"])) {
    return {
      text: "Cart is ready when you are. This checkout is a demo — no real charge, no real card captured. I'll walk you to the gate.",
      products: [],
      action: { type: "navigate", href: "/checkout" },
    };
  }

  if (includesAny(query, ["cart", "bag"])) {
    return {
      text: "Opening your bag. Quantities live there. I can keep recommending if the grid still feels unfinished.",
      products: [],
      action: { type: "navigate", href: "/cart" },
    };
  }

  const addIntent = includesAny(query, [
    "add",
    "cart it",
    "take it",
    "i'll take",
    "ill take",
    "get me",
  ]);
  const mentioned = findProductMention(query);

  if (addIntent && mentioned) {
    const size = detectSize(query);
    return {
      text: `Placed ${mentioned.name} in ${size} into the bag. Demo inventory, real taste. Want a second pair or shall I walk you to checkout?`,
      products: [mentioned],
      action: { type: "add", product: mentioned, size },
    };
  }

  if (addIntent && !mentioned) {
    const fallback = recommend(query, 1)[0];
    const size = detectSize(query);
    return {
      text: `I read that as a yes. ${fallback.name} in ${size} is in the bag. If you meant another pair, name it.`,
      products: [fallback],
      action: { type: "add", product: fallback, size },
    };
  }

  if (greetings.some((g) => query === g || query.startsWith(`${g} `))) {
    return {
      text: "Signal received. Tell me how you move — run, boardroom, night, lounge — or name a color and I'll do the rest.",
      products: products.filter((p) => p.limited),
      action: { type: "none" },
    };
  }

  if (includesAny(query, ["surprise", "anything", "you pick", "random", "recommend"])) {
    const picks = [...products].sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      text: "Three from the grid, no questionnaire. If one hits, say add and the name. If none hit, give me a constraint.",
      products: picks,
      action: { type: "none" },
    };
  }

  if (includesAny(query, ["help", "what can", "how do"])) {
    return {
      text: "I match pairs from the Nabil catalog. Talk like a human: I need quiet merino for a meeting or something glitchy and loud. I can add to cart, open checkout, or keep refining.",
      products: products.slice(0, 3),
      action: { type: "none" },
    };
  }

  const picks = recommend(query, 3);
  const top = picks[0];
  const reasons: string[] = [];
  if (includesAny(query, ["run", "gym"])) reasons.push("built for motion");
  if (includesAny(query, ["work", "board", "quiet"])) reasons.push("reads as composure");
  if (includesAny(query, ["night", "date", "party"])) reasons.push("holds a room");
  if (includesAny(query, ["limited"])) reasons.push("won't restock");
  if (includesAny(query, ["merino"])) reasons.push("temperature-honest wool");

  const flavor = reasons.length
    ? `I weighted for ${reasons.join(" / ")}.`
    : "I scored the catalog against what you said.";

  return {
    text: `${flavor} Lead pick is ${top.name} — ${top.tagline} Say add ${top.name} to bag it in M, or name a size.`,
    products: picks,
    action: { type: "none" },
  };
}
