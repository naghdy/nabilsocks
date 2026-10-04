# Environment

Variable **names** and where they are read. Values are never committed.

Secrets live in:

- Vercel → team `madar` (`madaret`) → project `nabilsocks` → Settings → Environment Variables
- the owner's secret store
- `.env.local` on a laptop (gitignored; copy from `.env.example`)

`.gitignore` ignores `.env*` and re-includes `.env.example` only. `.env.example` has empty secrets plus non-secret defaults (`PRINTIFY_SHOP_ID=28967994`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`).

This agent could **not** list which Vercel environments currently store each variable. The Vercel API returned 403 for team `madaret` ("Not authorized"). The table below is how the app is meant to be configured, not a dashboard export. After any env edit, redeploy.

| Name | Required | Read by | Intended placement |
| --- | --- | --- | --- |
| `STRIPE_SECRET_KEY` | Yes, to charge or load a session | `lib/stripe.ts`, `lib/env.ts` | **Production:** live key (`rk_live_…` today, or `sk_live_…`). **Local:** `sk_test_…` in `.env.local`. Do not put the live key on Preview unless that preview should charge real cards. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | **Not referenced in source.** Listed in `.env.example` for a future Stripe.js integration. | If set, Production gets `pk_live_…`, local gets `pk_test_…`. Safe to expose (publishable). Never prefix a secret with `NEXT_PUBLIC_`. |
| `STRIPE_WEBHOOK_SECRET` | Yes, to fulfill | `app/api/webhooks/stripe/route.ts` | **Production:** signing secret of live endpoint `we_1UGSPC413n8f2zECAsmzCOTr`. **Local:** `whsec_…` from `stripe listen`. Must match the mode of the events you send. |
| `PRINTIFY_API_TOKEN` | Yes, to create orders | `lib/printify.ts`, `lib/env.ts` | Production and any environment that should fulfill. Personal access token with `orders.read`, `orders.write`, `products.read`. Local only if you want hold orders. |
| `PRINTIFY_SHOP_ID` | No | `lib/printify.ts` | Optional everywhere. Unset → `28967994`. Non-secret. Already in `.env.example` and `PRINTIFY_SHOP_ID_DEFAULT`. |
| `NEXT_PUBLIC_SITE_URL` | No | `lib/site-url.ts` | **Production:** `https://www.nabilsocks.com` so success/cancel URLs stay on www. **Local example:** `http://localhost:3000`. If unset, the checkout route uses the request host, then `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. |
| `PRINTIFY_MAP_JSON` | No | `lib/printify-map.ts` | Optional overlay, same shape as `lib/printify-map.json` (slug → `printifyProductId` + `variants.S/M/L`). Invalid JSON is logged and ignored. Prefer editing the committed JSON. |
| `PRINTIFY_SHIPPING_METHOD` | No | `lib/printify.ts` | Optional. Unset or non-numeric → `1` (standard). |
| `PRINTIFY_SEND_TO_PRODUCTION` | No | `lib/fulfillment.ts` | Optional. `true`/`1` force production. `false`/`0` force hold. Unset → Stripe session `livemode`. Leave unset in production so live charges ship and test charges do not. |

Also read, not part of `.env.example`:

| Name | Who sets it | Effect |
| --- | --- | --- |
| `SITE_URL` | You, if you want a non-public alias | Second choice after `NEXT_PUBLIC_SITE_URL` in `getSiteUrl`. |
| `VERCEL_URL` | Vercel | Fallback site origin. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Vercel | Preferred over `VERCEL_URL` when no explicit site URL and no request host. |

`npm run build` does not need any of these. Checkout returns 503 without `STRIPE_SECRET_KEY`. The webhook returns 503 without the webhook secret. Fulfillment records `printify_status=unconfigured` without `PRINTIFY_API_TOKEN`.

## What must never be committed

- `sk_live_`, `rk_live_`, `sk_test_` secret values
- `whsec_` webhook secrets
- Printify personal access tokens
- `.env`, `.env.local`, `.env.production`

Shop id `28967994`, blueprint `496`, variant ids, product ids, Stripe account id, and webhook **endpoint** ids are identifiers, not credentials. They are documented on purpose.
