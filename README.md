# Nabil Socks

A next-generation **agentic** sock storefront for [nabilsocks.com](https://nabilsocks.com). Talk to Nabil, browse a distinctive catalog, bag a pair, and run a **demo checkout** — no real payments, no API keys, no backend required.

This is a production-feeling demo: dark glass, neon, client-side cart, and a scripted shopping agent that recommends from the live catalog.

## Fulfillment partner: Printify (EU)

Every listing is specified against **[Sublimation Crew Socks (EU)](https://printify.com/app/products/496/generic-brand/sublimation-crew-socks-eu)** (Printify catalog product `496`, provider **Textildruck Europa**, Halle, Germany):

- Crew length, 1/8" ribbed tube, dye-sublimation all-over print on calf **and** foot
- **Black heel tip + black toe tip only** (not a full black foot)
- **70% polyester / 25% cotton / 5% spandex** — polyester exterior, cotton interior
- Sizes **S, M, L** (official Printify US/EU chart; UK derived as US men − 1)
- No minimum order; EU production that can ship to Switzerland
- Typical production ~2–7 business days, then shipping

The storefront is **not** wired to the Printify API yet. Checkout remains a demo: no live orders are placed.

Retail prices stay in the **$26–34** range against a ~$12 base cost.

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
2. **Shop** — 10 crew designs photographed on the Printify EU AOP blank
3. **Product** — size (S / M / L), quantity, add to bag, Printify size guide + care
4. **Agent** (`/agent`) — ask for occasion / color / vibe; say `add Circuit Crew` to bag a pair
5. **Cart** — update qty, remove
6. **Checkout** — shipping + payment theater; success screen with a fake order id
7. **About** — brand story + honest Printify EU specs

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
components/     chrome, sock photos, agent, cart, checkout
lib/            products, agent matcher, cart store
public/products photoreal SKUs restyled to the Printify EU blank
```

## License

Private demo for Nabil Socks.
