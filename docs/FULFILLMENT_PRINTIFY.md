# Fulfillment — Printify

Paid Stripe sessions become Printify orders in `lib/fulfillment.ts` / `lib/printify.ts`. The shop is API-driven. Nothing in this repo publishes products to Etsy or Shopify.

## Shop and blank

| | |
| --- | --- |
| Shop name | Nabil Socks |
| Shop id | `28967994` (default in code and `.env.example` if `PRINTIFY_SHOP_ID` is unset) |
| Sales channel | Disconnected (custom / API). Not a connected Shopify or Etsy store. |
| Catalog blueprint | **496** — [Sublimation Crew Socks (EU)](https://printify.com/app/products/496/generic-brand/sublimation-crew-socks-eu) |
| Print provider | Textildruck Europa, Halle, Germany |
| Print | Dye sublimation all-over on calf and foot. **Black heel tip and black toe tip only** (not a full black foot). |
| Fabric | 70% polyester / 25% cotton / 5% spandex (polyester face, cotton inside) |
| Sizes | S, M, L. Chart in `lib/types.ts` (`SIZE_GUIDE` / `SIZE_CHART`). UK is derived as US men − 1; Printify does not publish UK for this SKU. |
| Artwork | Flat print files made in Printify Design Maker, then product photos shot to match that blank. |
| Publish state | Products are **unpublished** in Printify. That is fine for API orders. The code does not check publish status; it POSTs Create Order. If Printify rejects a draft, publish or enable S/M/L and replay the Stripe event (see README note and [RUNBOOK.md](RUNBOOK.md)). |

`PRINTIFY_SOCKS` in `lib/types.ts` sets `productId: 496` on every catalog row. That number is the **blueprint**, not the shop product id. Create Order needs the shop `product_id` (24-char hex) **and** the size `variant_id`.

## Variant ids are shared

S / M / L variant ids are blueprint size ids. They are the **same on every design**:

| Size | `variant_id` |
| --- | --- |
| S | `66447` |
| M | `66448` |
| L | `66449` |

The long integers shown in the Printify UI (for example Orbit Stripe SKUs `13157926986216562450`, `31981798884390687008`, `50380363104639054382`) are **SKUs**. They are not `variant_id`. They also exceed `Number.MAX_SAFE_INTEGER`. `scripts/dump-printify-map.mjs` skips ids with 16 or more digits for that reason.

## Shop product ids

From `lib/printify-map.json` (keyed by **slug**):

| Design | Slug | Printify `product_id` |
| --- | --- | --- |
| Circuit Crew | `circuit-crew` | `6aaae248d5714b7cbd0daaf6` |
| Pulse Crew | `pulse-crew` | `6aaae716d178a7928f075f2f` |
| Solar Flare | `solar-flare` | `6aaae80171c86c01df0e6ea5` |
| Void Walker | `void-walker` | `6aaae9ab5ca74edf1b082bce` |
| Glacier Crew | `glacier-crew` | `6aaaea625ca74edf1b082c1b` |
| Chromatic Drift | `chromatic-drift` | `6aaaeaee612292acda003ea4` |
| Signal Noise | `signal-noise` | `6aaaeb964ba9c49749037e4d` |
| Ember Thread | `ember-thread` | `6aaaec572ccc997f670732d8` |
| Quiet Protocol | `quiet-protocol` | `6aaaecfc0801ed5d40076aa6` |
| Orbit Stripe | `orbit-stripe` | `6aaaedb943a8179bdc0a7a88` |

Regenerate after edits in Printify:

```bash
PRINTIFY_API_TOKEN=… npm run printify:dump-map -- --write
```

That GETs `/v1/shops/{shop}/products/{id}.json` for each id already in the JSON file and rewrites S/M/L. It does not discover new products. Add the new slug and product id to the JSON (or pass them via `PRINTIFY_MAP_JSON`) first. See [RUNBOOK.md](RUNBOOK.md).

Token scopes used by this repo: `orders.read`, `orders.write`, `products.read`.

## Create Order

`POST https://api.printify.com/v1/shops/{shopId}/orders.json`

| Field | Source |
| --- | --- |
| `external_id` | Stripe Checkout Session id |
| `label` | Same session id |
| `line_items[].product_id` | Map for the resolved slug |
| `line_items[].variant_id` | `66447` / `66448` / `66449` |
| `line_items[].quantity` | Cart qty |
| `line_items[].external_id` | `{sessionId}:{slug}:{size}` |
| `shipping_method` | `PRINTIFY_SHIPPING_METHOD` or `1` (standard) |
| `is_printify_express` | `false` |
| `send_shipping_notification` | `false` |
| `address_to` | Stripe shipping address + customer email. Phone falls back to `0000000000` if Stripe did not collect one. Region falls back to `""`. |

Required on the Stripe address before create: `country`, `line1`, `city`, `postal_code`, and an email. Otherwise fulfillment throws and the webhook returns 500 (Stripe retries).

Then, when production is on:

`POST /v1/shops/{shopId}/orders/{orderId}/send_to_production.json`

## When orders go to production

`PRINTIFY_SEND_TO_PRODUCTION` in `lib/fulfillment.ts`:

| Value | Behavior |
| --- | --- |
| unset | Follow Stripe `session.livemode` (live → production, test → hold) |
| `true` or `1` | Always `send_to_production` |
| `false` or `0` | Always hold (`printify_status=created_hold`) |

**Live Checkout is real money and a real shipment.** Test keys keep orders on hold so local `4242` payments do not print socks.

`isStripeLiveMode()` (`sk_live_` only) is **not** what decides this. See [PAYMENTS_STRIPE.md](PAYMENTS_STRIPE.md). A live session created with `rk_live_` still has `livemode: true`.

## Shipping geography

One Printify account can ship worldwide, including the US. The EU provider is slower to the US. A US print provider could be added later; it is not in the map or the code.

Stripe Checkout only offers the country allowlist in `lib/currency.ts` (Europe plus GB, US, CA). Shoppers cannot enter a country outside that list, even if Printify would ship there.

Printify Choice (global fulfillment) is a Shopify/Etsy feature and does not cover this socks blueprint. This shop does not use it.

## Catalog prices (CHF)

From `lib/products.ts` (server is the source of truth):

| Design | CHF |
| --- | --- |
| Orbit Stripe | 26 |
| Glacier Crew | 27 |
| Circuit Crew | 28 |
| Ember Thread | 29 |
| Signal Noise | 30 |
| Pulse Crew | 32 |
| Solar Flare | 32 |
| Quiet Protocol | 33 |
| Void Walker | 34 |
| Chromatic Drift | 34 |

Retail sits above a roughly $12 / €11 blank cost. Base cost is not stored in the repo.
