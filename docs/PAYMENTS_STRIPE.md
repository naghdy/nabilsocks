# Payments — Stripe

## Account

| | |
| --- | --- |
| Dashboard name | ChatPT |
| Account id | `acct_1T1EDH413n8f2zEC` |
| Country | CH |
| Production mode | **Live.** Real cards are charged. |
| Currency in code | `chf` (`lib/currency.ts`). Catalog prices are whole francs; Stripe unit amounts are rappen (`price * 100`). |

The live secret on production is a **restricted key** (`rk_live_…`), not a secret key (`sk_live_…`). The value lives in Vercel env and the owner's secret store. It is not in git.

## Restricted-key permissions

Code paths that call the Stripe API:

| Call | Where | Permission |
| --- | --- | --- |
| `checkout.sessions.create` | `app/api/checkout/session/route.ts` | Checkout Sessions **write** |
| `checkout.sessions.retrieve` | webhook (re-fetch), `lib/order-confirmation.ts` (success page) | Checkout Sessions **read** |
| `checkout.sessions.update` | `lib/fulfillment.ts` (write Printify ids) | Checkout Sessions **write** |
| `checkout.sessions.list` | `fulfillPaymentIntent` | Checkout Sessions **read** |
| `paymentIntents.update` | `lib/fulfillment.ts` (same metadata on the PaymentIntent) | PaymentIntents **write** |
| `webhooks.constructEvent` | webhook route | Uses `STRIPE_WEBHOOK_SECRET`, not the API key |

On **2026-09-17**, checkout returned Stripe **Permission denied** because the restricted key lacked `checkout_session_write`. The owner was enabling it. The key also needs session **read** (success page and webhook) and PaymentIntent **write** (metadata). Whether `payment_intent_read` is granted does not matter for current code: the webhook uses the event payload and does not retrieve the PaymentIntent.

Confirm the live key still has Checkout Sessions write + read and PaymentIntents write, or replace it with `sk_live_…`. See [OPEN_ITEMS.md](OPEN_ITEMS.md).

## `rk_live_` vs `isStripeLiveMode()`

`lib/env.ts` treats a key as live only when it starts with `sk_live_`. An `rk_live_` key makes `isStripeLiveMode()` return **false**.

Effects:

- `POST /api/checkout/session` refuses to create a session when that helper is true **and** Printify is not ready (missing `PRINTIFY_API_TOKEN`, or a catalog slug missing from `lib/printify-map.json`). **This guard does not run for `rk_live_`.**
- `components/CheckoutForm.tsx` uses the same helper to disable the pay button (`stripeLive && !printifyReady`). Same gap.
- Send-to-production does **not** use the helper first. `shouldSendToProduction(session.livemode ?? isStripeLiveMode())` uses the Checkout Session's `livemode` boolean. Stripe sets `livemode: true` on live sessions created with a restricted key. So a paid live session still defaults to `send_to_production` unless `PRINTIFY_SEND_TO_PRODUCTION` is `false` or `0`.

If the restricted key is ever swapped for `sk_live_`, the Printify-ready guard starts working with no code change.

## What Checkout collects

`mode: payment`, `submit_type: pay`, billing address `auto`, phone collection on, shipping address limited to `SHIPPING_COUNTRIES` in `lib/currency.ts`:

CH, LI, DE, AT, FR, IT, BE, NL, LU, ES, PT, IE, PL, CZ, SK, SI, HR, HU, DK, SE, FI, NO, GB, US, CA.

That list is smaller than "Printify can ship worldwide." A country missing here never reaches Printify, because Stripe will not collect the address. See [FULFILLMENT_PRINTIFY.md](FULFILLMENT_PRINTIFY.md).

Session and PaymentIntent metadata both start with `cart` (see [ARCHITECTURE.md](ARCHITECTURE.md)). PaymentIntent `description` is `Nabil Socks`.

The publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) is in `.env.example` and is **not read by any source file**. Hosted Checkout redirects to `session.url`. Keep the var only if you add Stripe.js later. Do not put a secret in a `NEXT_PUBLIC_` variable.

## Webhooks

Both endpoints POST to `https://www.nabilsocks.com/api/webhooks/stripe`.

| Mode | Endpoint id | Events |
| --- | --- | --- |
| Live (account ChatPT) | `we_1UGSPC413n8f2zECAsmzCOTr` | `checkout.session.completed`, `payment_intent.succeeded` |
| Older test endpoint | `we_1UGRgy3GZXtywAYevjZs9MZS` | same two events, same URL |

The live endpoint id contains the account fragment `413n8f2zEC` (matches `acct_1T1EDH413n8f2zEC`). The test endpoint id contains `3GZXtywAYe`, which does **not** match that fragment. Treat it as a separate, possibly stale endpoint until someone confirms it in the Dashboard. Deleting it is an open item.

`STRIPE_WEBHOOK_SECRET` must be the signing secret of the endpoint that is actually delivering. A test `whsec_…` will reject live events and the reverse. The route returns 400 on a bad signature and 503 if the secret is unset (it will not process an unsigned body).

Local forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Put the CLI's `whsec_…` in `.env.local` as `STRIPE_WEBHOOK_SECRET`. That secret is not the production secret.

## Test cards (test mode only)

Use with `sk_test_` / `pk_test_` keys. Any future expiry, any CVC, any postal code.

| Number | Result |
| --- | --- |
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Card declined |

Test-mode sessions have `livemode: false`, so Printify orders are created and left **on hold** (`printify_status=created_hold`) unless `PRINTIFY_SEND_TO_PRODUCTION=true`.

## Emails

This app sends **no** email. There is no Resend, SMTP, or Stripe email API call.

- The success page prints `Receipt → {email}` from `customer_details.email`. That is the address Stripe collected, shown in the browser. It is not a message the site sent.
- The buyer may get a Stripe receipt if receipts are enabled in the Stripe Dashboard (Settings → Customer emails). That toggle is outside this repo.
- Printify create-order sets `send_shipping_notification: false`, so this integration does not ask Printify to email a shipping notice. Printify still receives the order.
- Fulfillment requires a customer email on the session. Checkout can pass `customer_email` from the form; Stripe Checkout also collects email.

## Switch production back to test mode

1. In Vercel → project `nabilsocks` → Settings → Environment Variables (Production):
   - `STRIPE_SECRET_KEY` → a `sk_test_…` key from the ChatPT account (test mode).
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → the matching `pk_test_…` if you keep it set (unused by current code).
   - `STRIPE_WEBHOOK_SECRET` → the signing secret of a **test** endpoint aimed at `https://www.nabilsocks.com/api/webhooks/stripe` (or the CLI secret only for local).
2. Leave Printify credentials in place if you still want hold orders created. Set `PRINTIFY_SEND_TO_PRODUCTION=false` if you want that explicit.
3. **Redeploy.** Env edits do not change the deployment that is already live.
4. Confirm a checkout session id starts with `cs_test_`.

Going back to live is the reverse: `rk_live_` or `sk_live_`, the live endpoint's signing secret (`we_1UGSPC413n8f2zECAsmzCOTr`), redeploy. Live mode plus default send-to-production **ships real goods**.
