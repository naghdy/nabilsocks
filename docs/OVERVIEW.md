# Overview

Nabil Socks is a futuristic agentic demo shop for [nabilsocks.com](https://www.nabilsocks.com). Shoppers browse ten crew-sock designs, talk to an on-site agent, bag a pair, pay with Stripe Checkout, and the paid order is sent to Printify for print-on-demand fulfillment.

## What it is

- **Brand:** Nabil Socks. Swiss shop, prices in CHF (about 26–34).
- **Catalog:** ten dye-sublimation crew designs on one blank. Photos are meant to match the blank that ships. See [HISTORY.md](HISTORY.md).
- **Blank:** Printify catalog product **496**, Sublimation Crew Socks (EU), printed by **Textildruck Europa** in Halle, Germany. All-over print except a black heel tip and black toe tip. 70% polyester / 25% cotton / 5% spandex. Sizes S / M / L. Details in [FULFILLMENT_PRINTIFY.md](FULFILLMENT_PRINTIFY.md).
- **Agent:** `/agent` is an in-process keyword agent (`lib/agent.ts`). It scores the catalog and can add a pair to the cart (for example "add Circuit Crew"). It does not call an LLM API and needs no model key.
- **Cart:** Zustand store `nabil-socks-cart` (version 3) in `localStorage`. Prices charged at checkout are re-read from `lib/products.ts` on the server. The browser cannot set the price.
- **Payments:** Stripe Checkout (hosted `session.url`). Production is live mode. See [PAYMENTS_STRIPE.md](PAYMENTS_STRIPE.md).
- **Fulfillment:** Stripe webhook creates a Printify order. In live mode that order is sent to production (real charge, real shipment) unless `PRINTIFY_SEND_TO_PRODUCTION` overrides it.

## Stack

| Piece | Where |
| --- | --- |
| Next.js 16 App Router, React 19, TypeScript | `app/`, `package.json` |
| Tailwind CSS 4 | `app/globals.css`, `postcss.config.mjs` |
| Framer Motion | storefront motion |
| Zustand persist | `lib/store.ts` |
| Stripe Node SDK | `lib/stripe.ts`, `app/api/` |
| Printify REST (`https://api.printify.com/v1`) | `lib/printify.ts` |

`npm run build` succeeds without API keys. Runtime checkout and webhooks return 503 until env is set. See [ENVIRONMENT.md](ENVIRONMENT.md) and [RUNBOOK.md](RUNBOOK.md).

## Routes

| Path | Role |
| --- | --- |
| `/` | Landing |
| `/shop` | Catalog |
| `/product/[slug]` | Product, size, add to bag |
| `/agent` | Agent chat |
| `/cart` | Bag |
| `/checkout` | Pay with Stripe. `?canceled=1` after cancel |
| `/checkout/success?session_id=` | Loads the Stripe session; shows the session id |
| `/about` | Brand and blank specs |
| `POST /api/checkout/session` | Creates a Checkout Session |
| `POST /api/webhooks/stripe` | Verifies Stripe and fulfills via Printify |

`next.config.ts` permanently redirects `/product/pulse-ankle` → `/product/pulse-crew` and `/product/glacier-no-show` → `/product/glacier-crew`.

## Read next

- [ARCHITECTURE.md](ARCHITECTURE.md) — flow and files
- [HOSTING_AND_DEPLOY.md](HOSTING_AND_DEPLOY.md) — domain, DNS, Vercel
- [PAYMENTS_STRIPE.md](PAYMENTS_STRIPE.md)
- [FULFILLMENT_PRINTIFY.md](FULFILLMENT_PRINTIFY.md)
