# Open items

Not implemented. Do not treat these as done.

1. **Confirm the live restricted key** on ChatPT (`acct_1T1EDH413n8f2zEC`) has Checkout Sessions **write and read**, and PaymentIntents **write**. On 2026-09-17, missing `checkout_session_write` produced Stripe "Permission denied" at checkout. Alternative: replace `rk_live_…` with `sk_live_…`. A secret key would also make `isStripeLiveMode()` true, so the "no live charge until Printify is ready" guard in `app/api/checkout/session/route.ts` would start applying. An `rk_live_` key never trips that guard (see [PAYMENTS_STRIPE.md](PAYMENTS_STRIPE.md)).
2. **Place one small real order** end to end on production and confirm the Printify order in shop `28967994` moves to production (`printify_status=submitted`, not only `created` or `created_hold`). Live mode ships a real pair and charges a real card.
3. **Order confirmation email.** The site sends none. The success page only displays the Stripe customer email. A buyer may get a Stripe receipt if that Dashboard toggle is on. Printify create sets `send_shipping_notification: false`. A custom confirmation email is still to be decided.
4. **Optional US print provider.** Textildruck Europa (Halle) ships to the US from the EU and is slower. Printify Choice does not cover these socks (Shopify/Etsy only). A second provider would need its own variant ids in the map; do not assume `66447`–`66449` exist there.
5. **Order samples** of the ten designs and compare them to `public/products/*.webp` before calling the photos finished.
6. **Delete the stale test webhook** `we_1UGRgy3GZXtywAYevjZs9MZS` if nothing still sends test events to `https://www.nabilsocks.com/api/webhooks/stripe`. Its id does not share the live account fragment `413n8f2zEC`. Keep live endpoint `we_1UGSPC413n8f2zECAsmzCOTr`.
