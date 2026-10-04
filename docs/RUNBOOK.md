# Runbook

## Add a sock design

Stay on the same blank. A new silhouette means new photos and a new map; do not invent one.

1. In Printify shop **28967994**, create the design on blueprint **496** / Textildruck Europa. Flat art via Design Maker, same as the other ten. Unpublished is fine.
2. Copy the shop product id (24-char hex from the product URL or API). Confirm S/M/L variant ids are still `66447` / `66448` / `66449`. Ignore UI SKUs.
3. Add a product object in `lib/products.ts` (unique `slug`, CHF `price`, `printify: PRINTIFY_SOCKS`). `id` should match `slug` for new rows. Add the slug to `featuredSlugs` only if it belongs on the landing page.
4. Add `/public/products/{slug}.webp`. `SockPhoto` requests that path. The photo must be the all-over crew with black heel and toe tips.
5. Add the slug to `lib/printify-map.json`:

   ```json
   "new-slug": {
     "printifyProductId": "hex-id",
     "variants": { "S": 66447, "M": 66448, "L": 66449 }
   }
   ```

6. Optional check: `PRINTIFY_API_TOKEN=… npm run printify:dump-map -- --write` (rewrites variant ids for ids already in the file).
7. `npm run build`. Live checkout with an `sk_live_` key stays blocked until every catalog slug is mapped. An `rk_live_` key does not apply that block; map the product before it can be purchased anyway.

`PRINTIFY_MAP_JSON` can overlay one slug without a deploy of the JSON file, but a commit to `lib/printify-map.json` is the durable fix. Redeploy after changing the env overlay.

## Local development

```bash
npm install
cp .env.example .env.local
```

Fill **test** Stripe keys and a test webhook secret. Printify token is optional; without it, payment can succeed and the webhook records `printify_status=unconfigured`.

```bash
npm run dev
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Open http://localhost:3000. Pay with `4242 4242 4242 4242`. Expect `printify_status=created_hold` if Printify is configured, not a production job.

`npm run build` with an empty env must succeed.

## Rotate keys

1. Create the new key in Stripe or Printify. Do not delete the old one until the new deployment is healthy.
2. Update the matching name in Vercel Production (and `.env.local` if you rotated a test key).
3. For Stripe webhooks, reveal the endpoint signing secret only after you roll the endpoint secret, and set `STRIPE_WEBHOOK_SECRET` to that value.
4. Redeploy production. Env changes do not attach to the current deployment by themselves.
5. Revoke the old key. Never paste the new value into git, a PR, or chat logs.

## Redeploy

Push to `main` (production auto-deploy), or Redeploy in the Vercel UI for the `nabilsocks` project. Use a redeploy with the latest env after changing variables. Framework preset must stay **Next.js**.

## A paid order did not become a Printify job

1. Stripe Dashboard → the live payment → Checkout Session. Note `livemode`, `payment_status`, and metadata `cart`, `printify_order_id`, `printify_status`.
2. Developers → Events. Find `checkout.session.completed` (and `payment_intent.succeeded`). Delivery to `https://www.nabilsocks.com/api/webhooks/stripe` should be 2xx. 400 means the webhook secret does not match this endpoint. 503 means `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` was missing. 500 means fulfillment threw; Stripe will retry.
3. Vercel → project `nabilsocks` → Logs (runtime, production), same timestamp. Look for `Fulfillment failed`, `Printify map missing`, `Could not decode paid cart`, or `Permission denied`.
4. Read `printify_status`:

   | Status | Meaning | What to do |
   | --- | --- | --- |
   | `unconfigured` | No `PRINTIFY_API_TOKEN` on that deployment | Set it, redeploy, replay the event |
   | `invalid_cart` | `metadata.cart` empty or unknown product id | Fix the session metadata or the catalog; replay |
   | `unmapped` | Slug missing from `lib/printify-map.json` | Add the map, deploy, replay |
   | `created` | Order id saved; `send_to_production` did not finish | Printify order exists but may not be in production. Fix the API error, replay. Replay is safe if it later reaches `submitted`. |
   | `created_hold` | Created on purpose (test session, or flag `false`/`0`) | Send to production in Printify only if you intend to print. Do not flip the flag on a test card by accident. |
   | `submitted` | Sent to production | Look up `printify_order_id` in shop 28967994 |
   | (none) | Webhook never succeeded | Fix secret / permissions, then Resend the event |

5. `checkout_session_write` / session update failures are logged as "Failed to persist Printify ids" and do not roll back a Printify order that was already created. Search Printify by external id = session id (`cs_…`). The lookup only scans the first 5 pages of 50 orders.

Resend from the Stripe event page. Do not create a second Printify order by hand unless lookup shows none; `external_id` is the session id.

## Failed checkout before payment ("Permission denied")

The restricted live key cannot `checkout.sessions.create`. Enable Checkout Sessions write (and read, plus PaymentIntents write) on the restricted key, or switch `STRIPE_SECRET_KEY` to `sk_live_…`, then redeploy. No Printify order exists yet.
