# Nabil Socks

A next-generation **agentic** sock storefront for [nabilsocks.com](https://nabilsocks.com). Talk to Nabil, browse the catalog, bag a pair, and pay with **Stripe Checkout**. Paid orders are fulfilled through the **Printify API** (Sublimation Crew Socks EU, Textildruck Europa).

## Fulfillment partner: Printify (EU)

Every listing is specified against **[Sublimation Crew Socks (EU)](https://printify.com/app/products/496/generic-brand/sublimation-crew-socks-eu)** (Printify catalog product `496`, provider **Textildruck Europa**, Halle, Germany):

- Crew length, 1/8" ribbed tube, dye-sublimation all-over print on calf **and** foot
- **Black heel tip + black toe tip only** (not a full black foot)
- **70% polyester / 25% cotton / 5% spandex** — polyester exterior, cotton interior
- Sizes **S, M, L** (official Printify US/EU chart; UK derived as US men − 1)
- No minimum order; EU production that can ship to Switzerland
- Typical production ~2–7 business days, then shipping

Retail prices stay in the **CHF 26–34** range against a ~$12 / ~€11 base cost. **Currency is CHF** (Swiss brand). EUR would also work in Stripe; this repo uses CHF so the catalog numbers match what Swiss customers expect.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand + `localStorage` for the cart
- Stripe Checkout (server-created sessions + webhook)
- Printify REST API (orders after payment)

## Local development

```bash
npm install
cp .env.example .env.local
# fill Stripe + Printify keys (optional for `next build`; required to pay)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

`npm run build` succeeds **without** API keys. Checkout and webhook routes compile and return clear 503s at runtime until env is set.

## Environment variables

Copy `.env.example`. Never put secrets in client code or `NEXT_PUBLIC_*` except the Stripe **publishable** key.

| Variable | Where | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Server | Create Checkout Sessions, retrieve sessions, verify nothing on the client |
| `STRIPE_WEBHOOK_SECRET` | Server | Verify `Stripe-Signature` on `/api/webhooks/stripe` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client (optional) | Hosted Checkout redirects via `session.url` and does not need it; keep it for Stripe.js / future embedded Checkout |
| `NEXT_PUBLIC_SITE_URL` | Server/client | Success/cancel URLs. On Vercel you can omit this (`VERCEL_URL` is used) |
| `PRINTIFY_API_TOKEN` | Server | Printify PAT (`orders.read`, `orders.write`, `products.read`) |
| `PRINTIFY_SHOP_ID` | Server | Numeric shop id from Printify |
| `PRINTIFY_MAP_JSON` | Server (optional) | JSON overlay of slug → product/variant ids (same shape as `lib/printify-map.json`) |
| `PRINTIFY_SHIPPING_METHOD` | Server (optional) | Printify shipping method id; default `1` (standard) |
| `PRINTIFY_SEND_TO_PRODUCTION` | Server (optional) | `true`/`false`. Default: **true in Stripe live mode**, **false in test mode** (orders stay on hold) |

### Stripe test vs live

- **Test:** `sk_test_…` / `pk_test_…`, card `4242 4242 4242 4242`. Webhook secret from `stripe listen` or the test endpoint in the Dashboard. Printify orders are created but **not** sent to production unless you set `PRINTIFY_SEND_TO_PRODUCTION=true`.
- **Live:** `sk_live_…` / `pk_live_…`. The create-session route **refuses live charges** until Printify credentials **and** a complete product map are present.

Local webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the `whsec_…` it prints as `STRIPE_WEBHOOK_SECRET`.

### Stripe webhook endpoint (production / preview)

In Stripe Dashboard → Developers → Webhooks, add:

```
https://nabilsocks.com/api/webhooks/stripe
```

For Vercel previews, either use Stripe CLI or add the preview URL. Events to send:

- `checkout.session.completed` (primary — creates the Printify order)
- `payment_intent.succeeded` (optional backup; same fulfillment path, idempotent)

The handler verifies signatures with `STRIPE_WEBHOOK_SECRET`. Unsigned bodies are rejected.

## Printify product / variant mapping

Site slugs live in `lib/products.ts`. **Shop** product ids (hex strings) and size **variant ids** (integers) live in [`lib/printify-map.json`](lib/printify-map.json), documented in [`lib/printify-map.ts`](lib/printify-map.ts).

Blueprint `496` is the catalog blank. It is **not** the id you paste. Each draft in Printify → **My products** has its own shop product id.

### Fill IDs by hand

1. Printify → My products → open a draft (Circuit Crew, Pulse Crew, Solar Flare, Void Walker, Glacier Crew, Chromatic Drift, Signal Noise, Ember Thread, Quiet Protocol, Orbit Stripe).
2. Copy the id from the URL: `https://printify.com/app/products/{THIS_HEX_ID}`.
3. Open Variants. Copy the numeric variant id for **S**, **M**, and **L**.
4. Paste into `lib/printify-map.json` (or set `PRINTIFY_MAP_JSON` on Vercel).

Placeholders (`""` / `0`) fail fulfillment until replaced.

### Fill IDs from the API

```bash
PRINTIFY_API_TOKEN=… PRINTIFY_SHOP_ID=… npm run printify:dump-map
PRINTIFY_API_TOKEN=… PRINTIFY_SHOP_ID=… npm run printify:dump-map -- --write
```

The script matches Printify product titles to site slugs and writes variant ids whose titles contain S/M/L.

If order create fails on unpublished drafts, publish the product (or enable the S/M/L variants) in that Printify shop and retry the Stripe webhook.

## Checkout flow

1. **Bag** — client cart (slug/size/qty). Prices always come from `lib/products.ts`, never from the browser.
2. **Pay with Stripe** — `POST /api/checkout/session` creates a Checkout Session (CHF line items, `shipping_address_collection`, phone). Browser redirects to `session.url`.
3. **Success** — `/checkout/success?session_id={CHECKOUT_SESSION_ID}` loads the session from Stripe and shows that id (not a fake demo id).
4. **Webhook** — `checkout.session.completed` maps line items via `lib/printify-map.ts`, creates a Printify order with `external_id = Stripe session id`, stores `printify_order_id` on the session metadata, then `send_to_production` when appropriate.
5. **Idempotency** — webhook retries reuse Stripe metadata + Printify `external_id` lookup so a second event does not double-create.

Printify tokens and Stripe secret keys are only imported from `server-only` modules / Route Handlers.

## Demo flows

1. **Landing** — brand, agent teaser, featured pairs
2. **Shop** — 10 crew designs photographed on the Printify EU AOP blank
3. **Product** — size (S / M / L), quantity, add to bag, Printify size guide + care
4. **Agent** (`/agent`) — ask for occasion / color / vibe; say `add Circuit Crew` to bag a pair
5. **Cart** — update qty, remove
6. **Checkout** — Pay with Stripe; success screen with the Stripe session id
7. **About** — brand story + Printify EU specs

## Deploy on Vercel

1. Push this repo to GitHub (already the case for `naghdy/nabilsocks`).
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo.
3. Framework preset: **Next.js**. Build command `npm run build`.
4. Add the env vars from `.env.example` (Stripe + Printify). Do not skip `STRIPE_WEBHOOK_SECRET`.
5. Deploy. Point Stripe’s webhook at `https://<your-domain>/api/webhooks/stripe`.
6. Confirm the `*.vercel.app` URL, then the custom domain.

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
app/                    routes (shop, product, agent, cart, checkout, about)
app/api/checkout/       Stripe Checkout Session create
app/api/webhooks/stripe Stripe webhook → Printify order
components/             chrome, sock photos, agent, cart, checkout
lib/                    products, printify map, Stripe/Printify server helpers
scripts/                dump Printify product/variant ids
public/products         photoreal SKUs restyled to the Printify EU blank
```

## License

Private storefront for Nabil Socks.
