# Nabil Socks

A next-generation **agentic** sock storefront for [nabilsocks.com](https://nabilsocks.com). Talk to Nabil, browse a distinctive catalog, bag a pair, and run a **demo checkout** — no real payments, no API keys, no backend required.

This is a production-feeling demo: dark glass, neon, client-side cart, and a scripted shopping agent that recommends from the live catalog.

## Fulfillment partner: Printful

Every listing is specified against **[Black Foot Sublimated Socks](https://www.printful.com/custom/socks/personalized/black-foot-sublimated-socks)** (Printful catalog product `186`):

- Crew length, cushioned black foot, ribbed leg, sublimation print on the upper
- **60% nylon / 22% cotton / 18% spandex**
- Sizes **M, L, XL** only
- Print-on-demand / made to order (typical fulfill ~2–5 business days, then shipping)

The storefront is **not** wired to the Printful API yet. Checkout remains a demo: no live orders are placed.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand + `localStorage` for the cart
- Local TypeScript modules for products and agent copy

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

No environment variables are required.

## Demo flows

1. **Landing** — brand, agent teaser, featured pairs
2. **Shop** — 10 crew designs with CSS/SVG art (no remote images)
3. **Product** — size (M / L / XL), quantity, add to bag, Printful size guide + care
4. **Agent** (`/agent`) — ask for occasion / color / vibe; say `add Circuit Crew` to bag a pair
5. **Cart** — update qty, remove
6. **Checkout** — shipping + payment theater; success screen with a fake order id
7. **About** — brand story + honest Printful specs

Checkout never charges a card. Fields are not sent to a processor.

## Deploy on Vercel

1. Push this repo to GitHub (already the case for `naghdy/nabilsocks`).
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo.
3. Framework preset: **Next.js**. Build command `npm run build`, output as Next.js default. Leave env vars empty.
4. Deploy. Confirm the `*.vercel.app` URL.

### Point nabilsocks.com at Vercel (DNS, not a redirect)

Namecheap **URL Redirect / forwarding** will 301 the domain and break the brand URL. Use **Advanced DNS** records instead.

1. In the Vercel project: **Settings → Domains** → add `nabilsocks.com` and `www.nabilsocks.com`.
2. In Namecheap: **Domain List → nabilsocks.com → Advanced DNS**.
3. Remove any **URL Redirect Record** (and leftover parking records you do not need).
4. Add the records Vercel displays. Typically:

   | Type  | Host | Value                 | TTL        |
   | ----- | ---- | --------------------- | ---------- |
   | A     | `@`  | `10.0.1.2`          | Automatic  |
   | CNAME | `www`| `cname.vercel-dns.com`| Automatic  |

   If Vercel shows different values, use those. They are the source of truth.
5. Save. Propagation can take from minutes to a few hours.
6. Keep the Namecheap nameservers as Namecheap’s (or your DNS host). You are pointing records **to** Vercel, not transferring the domain.

After Vercel marks the domain valid, `https://nabilsocks.com` serves this app.

## Project layout

```
app/            routes (shop, product, agent, cart, checkout, about)
components/     chrome, sock art, agent, cart, checkout
lib/            products, agent matcher, cart store
```

## License

Private demo for Nabil Socks.
