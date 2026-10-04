<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nabil Socks — agent entry point

Futuristic agentic demo shop for [nabilsocks.com](https://www.nabilsocks.com). Next.js App Router storefront, on-site agent chat, cart, Stripe Checkout, Printify print-on-demand fulfillment.

Read next, in this order:

1. [docs/OVERVIEW.md](docs/OVERVIEW.md) — what the shop is
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — request flow and key files
3. [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) — env var **names** only
4. The doc for the area you are touching: [payments](docs/PAYMENTS_STRIPE.md), [fulfillment](docs/FULFILLMENT_PRINTIFY.md), [hosting](docs/HOSTING_AND_DEPLOY.md), [runbook](docs/RUNBOOK.md), [history](docs/HISTORY.md), [open items](docs/OPEN_ITEMS.md)

`.env.example` lists the same variable names. `README.md` is the human quick start; if it disagrees with `docs/` or the code, trust the code, then `docs/`.

## Golden rules

- **No secrets in git.** Never commit API keys, tokens, webhook secrets, or `.env.local`. Document variable **names** and where values live (Vercel project env + the owner's secret store). `.env*` is gitignored except `.env.example`.
- **Stripe on production is LIVE.** Real cards are charged. The live secret is a restricted key (`rk_live_…`) on Stripe account ChatPT. See [docs/PAYMENTS_STRIPE.md](docs/PAYMENTS_STRIPE.md).
- **Printify live mode spends real money and ships real socks.** When a Checkout Session is `livemode`, `lib/fulfillment.ts` calls Printify `send_to_production` unless `PRINTIFY_SEND_TO_PRODUCTION` is explicitly `false`/`0`. A test-mode session stays on hold unless that flag is `true`/`1`.
- **Local dev uses test keys** (`sk_test_` / `pk_test_`, test webhook secret). Card `4242 4242 4242 4242`. Do not point local webhooks at the live secret.
- **`npm run build` must stay green with no keys.** Checkout and the webhook return 503 at runtime until env is set. Do not make the build import or require secrets.
- **Product photos must match what actually ships** (Printify Sublimation Crew Socks EU, all-over print, black heel and toe tips). Do not bring back the old merino / knee-high / no-show catalog.
- **Printify variant ids are `66447` / `66448` / `66449` (S/M/L).** The long numbers in the Printify UI are SKUs, not variant ids.
- **`lib/env.ts` `isStripeLiveMode()` only matches `sk_live_`.** A restricted `rk_live_` key is live at Stripe but this helper returns false, so the "block checkout until Printify is ready" guard does not run. Fulfillment still uses the session's own `livemode` flag. Details in [docs/PAYMENTS_STRIPE.md](docs/PAYMENTS_STRIPE.md).
