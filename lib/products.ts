import type { Product } from "./types";

export const products: Product[] = [
  {
    id: "circuit-crew",
    slug: "circuit-crew",
    name: "Circuit Crew",
    tagline: "Printed like a motherboard. Knit like a cloud.",
    description:
      "Void-black merino mapped with electric cyan traces. Circuit Crew is the house signature — a crew that reads as infrastructure until it moves, then it reads as light. Cushioned sole, invisible seam, built for the city that never logs off.",
    price: 28,
    height: "crew",
    material: "merino",
    colors: ["black", "cyan", "electric"],
    vibe: ["tech", "cyber", "loud", "daily"],
    occasion: ["city", "night", "travel", "gift"],
    art: {
      pattern: "circuit",
      primary: "#071018",
      secondary: "#22f0ff",
      accent: "#7cf6ff",
    },
  },
  {
    id: "pulse-ankle",
    slug: "pulse-ankle",
    name: "Pulse Ankle",
    tagline: "A heartbeat you can wear under a cuff.",
    description:
      "Midnight cashmere-silk with a magenta pulse that rings the ankle like a vital sign. Low profile, high signal. For rooms where the lighting is expensive and the conversation is not.",
    price: 36,
    height: "ankle",
    material: "cashmere-silk",
    colors: ["black", "magenta", "midnight"],
    vibe: ["luxury", "night", "loud"],
    occasion: ["date", "night", "party", "gift"],
    art: {
      pattern: "pulse",
      primary: "#0a0610",
      secondary: "#ff2bd6",
      accent: "#ff8ae8",
    },
  },
  {
    id: "solar-flare",
    slug: "solar-flare",
    name: "Solar Flare",
    tagline: "A limited burn across organic cotton rib.",
    description:
      "Gold collapses into ember as the rib catches light. Solar Flare is a numbered drop — organic cotton, dense cuff, the kind of warmth that looks like a warning. When it’s gone, the sun keeps moving.",
    price: 32,
    height: "crew",
    material: "organic-cotton",
    colors: ["gold", "orange", "ember"],
    vibe: ["warm", "loud", "limited"],
    occasion: ["weekend", "travel", "gift"],
    limited: true,
    art: {
      pattern: "flare",
      primary: "#2a1206",
      secondary: "#ffb020",
      accent: "#ff5a1f",
    },
  },
  {
    id: "void-walker",
    slug: "void-walker",
    name: "Void Walker",
    tagline: "Knee-highs for people who stay out past the map.",
    description:
      "Deep-violet merino that drinks the room and returns a faint starfield. Void Walker climbs to the knee with a compression that feels like a decision. Late trains, later studios, no small talk.",
    price: 42,
    height: "knee",
    material: "merino",
    colors: ["purple", "violet", "black"],
    vibe: ["night", "cyber", "quiet", "editorial"],
    occasion: ["night", "studio", "travel"],
    art: {
      pattern: "void",
      primary: "#12081c",
      secondary: "#8b5cff",
      accent: "#d4b8ff",
    },
  },
  {
    id: "glacier-no-show",
    slug: "glacier-no-show",
    name: "Glacier No-Show",
    tagline: "Ice you can hide in a shoe.",
    description:
      "Technical mesh cut to vanish. Glacier is a no-show with a crystalline cool — ice-blue structure, anti-slip heel cup, breathable enough for a summer that forgot to end. Invisible, until someone asks why your feet look that calm.",
    price: 22,
    height: "no-show",
    material: "technical-mesh",
    colors: ["ice", "blue", "white"],
    vibe: ["athletic", "minimal", "quiet", "cool"],
    occasion: ["run", "gym", "travel", "daily"],
    art: {
      pattern: "glacier",
      primary: "#d8f4ff",
      secondary: "#7ad7ff",
      accent: "#1a6b88",
    },
  },
  {
    id: "chromatic-drift",
    slug: "chromatic-drift",
    name: "Chromatic Drift",
    tagline: "Bamboo that refuses a single color.",
    description:
      "A crew that drifts as you turn — cyan into magenta into a color that doesn’t have a name yet. Bamboo viscose, temperature-smart, slightly irresponsible in meetings. Drift is for people who treat dressing as weather.",
    price: 34,
    height: "crew",
    material: "bamboo",
    colors: ["cyan", "magenta", "iridescent"],
    vibe: ["loud", "chromatic", "daily"],
    occasion: ["weekend", "party", "gift", "city"],
    art: {
      pattern: "chromatic",
      primary: "#14081a",
      secondary: "#22f0ff",
      accent: "#ff2bd6",
    },
  },
  {
    id: "signal-noise",
    slug: "signal-noise",
    name: "Signal Noise",
    tagline: "A limited glitch. Intentionally broken.",
    description:
      "Recycled polyester woven like a corrupted frame. Signal Noise is a drop for the people who like their errors beautiful — torn blocks of cyan, magenta, and void. Once the batch ends, the file is deleted.",
    price: 30,
    height: "crew",
    material: "recycled-poly",
    colors: ["black", "cyan", "magenta"],
    vibe: ["glitch", "loud", "tech", "limited"],
    occasion: ["night", "party", "gift"],
    limited: true,
    art: {
      pattern: "glitch",
      primary: "#07070c",
      secondary: "#22f0ff",
      accent: "#ff2bd6",
    },
  },
  {
    id: "ember-thread",
    slug: "ember-thread",
    name: "Ember Thread",
    tagline: "Rust merino for streets that remember autumn.",
    description:
      "A mid-calf knit the color of a cooling furnace. Ember Thread is merino with a dry, mineral warmth — no logos, no neon, just a slow burn at the ankle. For walks that start as errands and become thinking.",
    price: 29,
    height: "mid-calf",
    material: "merino",
    colors: ["rust", "orange", "brown"],
    vibe: ["warm", "quiet", "editorial"],
    occasion: ["weekend", "travel", "daily"],
    art: {
      pattern: "ember",
      primary: "#2a1008",
      secondary: "#c45a28",
      accent: "#f0c08a",
    },
  },
  {
    id: "quiet-protocol",
    slug: "quiet-protocol",
    name: "Quiet Protocol",
    tagline: "Off-white merino. Boardroom stealth.",
    description:
      "The pair you wear when the room is listening. Quiet Protocol is an ankle in undyed-looking merino — almost cream, almost nothing — with a hand-feel that costs more than it admits. Formal without announcing the protocol.",
    price: 38,
    height: "ankle",
    material: "merino",
    colors: ["cream", "white", "ivory"],
    vibe: ["quiet", "luxury", "minimal"],
    occasion: ["work", "boardroom", "date", "gift"],
    art: {
      pattern: "quiet",
      primary: "#f3efe6",
      secondary: "#c8c0b0",
      accent: "#6b6458",
    },
  },
  {
    id: "orbit-stripe",
    slug: "orbit-stripe",
    name: "Orbit Stripe",
    tagline: "Athletic crew. Two bodies, one gravity.",
    description:
      "Cyan and magenta bands lock in orbit around a graphite field. Orbit Stripe is the training crew — arch support, stay-up cuff, a little theater for people who still treat motion as a ritual. Run, lift, or just leave the building faster.",
    price: 26,
    height: "crew",
    material: "technical-mesh",
    colors: ["cyan", "magenta", "graphite"],
    vibe: ["athletic", "loud", "daily"],
    occasion: ["run", "gym", "travel", "daily"],
    art: {
      pattern: "orbit",
      primary: "#101018",
      secondary: "#22f0ff",
      accent: "#ff2bd6",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function formatHeight(height: Product["height"]) {
  return height.replace("-", " ");
}

export function formatMaterial(material: Product["material"]) {
  return material.replace("-", " ");
}

export const featuredSlugs = [
  "circuit-crew",
  "pulse-ankle",
  "solar-flare",
  "void-walker",
];
