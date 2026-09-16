import {
  MATERIAL_LABEL,
  PRINTFUL_SOCKS,
  type Material,
  type Product,
  type SockHeight,
} from "./types";

const printful = PRINTFUL_SOCKS;

export const products: Product[] = [
  {
    id: "circuit-crew",
    slug: "circuit-crew",
    name: "Circuit Crew",
    tagline: "Printed like a motherboard. Black foot stays dark.",
    description:
      "Void-black crew mapped with electric cyan traces — sublimation on the ribbed leg, cushioned black foot left unprinted. Circuit Crew is the house signature: infrastructure until it moves, then it reads as light. Same Printful Black Foot blank as the rest of the grid, made to order.",
    price: 28,
    height: "crew",
    material: "nylon-blend",
    colors: ["black", "cyan", "electric"],
    vibe: ["tech", "cyber", "loud", "daily"],
    occasion: ["city", "night", "travel", "gift"],
    printful,
    art: {
      pattern: "circuit",
      primary: "#071018",
      secondary: "#22f0ff",
      accent: "#7cf6ff",
    },
  },
  {
    id: "pulse-ankle",
    slug: "pulse-crew",
    name: "Pulse Crew",
    tagline: "A heartbeat printed as an ankle-band graphic.",
    description:
      "Midnight crew with a magenta pulse that rings the ankle like a vital sign — graphics live on the ribbed upper; the cushioned foot stays black. Crew length, high signal. For rooms where the lighting is expensive and the conversation is not.",
    price: 32,
    height: "crew",
    material: "nylon-blend",
    colors: ["black", "magenta", "midnight"],
    vibe: ["luxury", "night", "loud"],
    occasion: ["date", "night", "party", "gift"],
    aliases: ["pulse ankle", "pulse-ankle", "pulse"],
    printful,
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
    tagline: "A limited burn across a ribbed crew.",
    description:
      "Gold collapses into ember as the rib catches light. Solar Flare is a numbered drop — sublimated flare on the crew leg, dense rib, cushioned black foot. Nylon-cotton-spandex blend, printed to order. When it’s gone, the sun keeps moving.",
    price: 32,
    height: "crew",
    material: "nylon-blend",
    colors: ["gold", "orange", "ember"],
    vibe: ["warm", "loud", "limited"],
    occasion: ["weekend", "travel", "gift"],
    limited: true,
    printful,
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
    tagline: "A crew starfield for people who stay out past the map.",
    description:
      "Deep-violet crew that drinks the room and returns a faint starfield on the ribbed leg. Void Walker is not a knee-high — it is crew length with space printed on the upper and a black cushioned foot below. Late trains, later studios, no small talk.",
    price: 34,
    height: "crew",
    material: "nylon-blend",
    colors: ["purple", "violet", "black"],
    vibe: ["night", "cyber", "quiet", "editorial"],
    occasion: ["night", "studio", "travel"],
    printful,
    art: {
      pattern: "void",
      primary: "#12081c",
      secondary: "#8b5cff",
      accent: "#d4b8ff",
    },
  },
  {
    id: "glacier-no-show",
    slug: "glacier-crew",
    name: "Glacier Crew",
    tagline: "Ice you can wear above the shoe.",
    description:
      "Ice-blue crystalline structure sublimated up a ribbed crew. Glacier is no longer a no-show — it is an ice design you can actually see, with a cushioned black foot and a cool athletic read. Nylon blend, printed to order, built for days that forgot to end.",
    price: 27,
    height: "crew",
    material: "nylon-blend",
    colors: ["ice", "blue", "white"],
    vibe: ["athletic", "minimal", "quiet", "cool"],
    occasion: ["run", "gym", "travel", "daily"],
    aliases: ["glacier no-show", "glacier-no-show", "glacier noshow", "glacier"],
    printful,
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
    tagline: "A crew that refuses a single color.",
    description:
      "A crew that drifts as you turn — cyan into magenta into a color that doesn’t have a name yet, all of it sublimated on the ribbed leg. Black cushioned foot underneath. Drift is for people who treat dressing as weather.",
    price: 34,
    height: "crew",
    material: "nylon-blend",
    colors: ["cyan", "magenta", "iridescent"],
    vibe: ["loud", "chromatic", "daily"],
    occasion: ["weekend", "party", "gift", "city"],
    printful,
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
      "Torn blocks of cyan, magenta, and void sublimated like a corrupted frame. Signal Noise is a drop for people who like their errors beautiful. Crew length, ribbed leg, cushioned black foot. Once the batch ends, the file is deleted.",
    price: 30,
    height: "crew",
    material: "nylon-blend",
    colors: ["black", "cyan", "magenta"],
    vibe: ["glitch", "loud", "tech", "limited"],
    occasion: ["night", "party", "gift"],
    limited: true,
    printful,
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
    tagline: "Rust print for streets that remember autumn.",
    description:
      "A crew the color of a cooling furnace. Ember Thread is a slow-burn sublimation on the ribbed leg — no logos, no neon, just mineral warmth in the graphic and a black cushioned foot below. For walks that start as errands and become thinking.",
    price: 29,
    height: "crew",
    material: "nylon-blend",
    colors: ["rust", "orange", "brown"],
    vibe: ["warm", "quiet", "editorial"],
    occasion: ["weekend", "travel", "daily"],
    printful,
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
    tagline: "Off-white crew. Boardroom stealth.",
    description:
      "The pair you wear when the room is listening. Quiet Protocol is a cream-field sublimation on a ribbed crew — almost cream, almost nothing — with a black cushioned foot that stays out of the conversation. Formal without announcing the protocol.",
    price: 33,
    height: "crew",
    material: "nylon-blend",
    colors: ["cream", "white", "ivory"],
    vibe: ["quiet", "luxury", "minimal"],
    occasion: ["work", "boardroom", "date", "gift"],
    printful,
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
      "Cyan and magenta bands lock in orbit around a graphite field on the ribbed leg. Orbit Stripe is the training crew — stay-up rib, black cushioned foot, a little theater for people who still treat motion as a ritual. Run, lift, or just leave the building faster.",
    price: 26,
    height: "crew",
    material: "nylon-blend",
    colors: ["cyan", "magenta", "graphite"],
    vibe: ["athletic", "loud", "daily"],
    occasion: ["run", "gym", "travel", "daily"],
    printful,
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

export function formatHeight(height: SockHeight) {
  return height;
}

export function formatMaterial(material: Material) {
  return MATERIAL_LABEL[material];
}

export function formatMaterialShort(material: Material) {
  return material === "printful-sublimation" ? "sublimated nylon" : "nylon blend";
}

export const featuredSlugs = [
  "circuit-crew",
  "pulse-crew",
  "solar-flare",
  "void-walker",
];
