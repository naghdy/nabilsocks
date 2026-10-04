# History

Decision log. Dates on merge commits are `git log` dates on `main`. The owner's note for the Stripe go-live is not a commit.

## Principle

**Product photos must match what actually ships.** The owner dropped an earlier fake luxury catalog (merino, knee-highs, and other blanks the printer does not produce) so the site would not sell a sock the photo does not show.

## Timeline

| When | What | Git |
| --- | --- | --- |
| 2026-09-10 | Initial commit and the first storefront (agent, cart, catalog). | `6653d79`, `a81b740` |
| 2026-09-11 | **PR #1** merged — agentic demo store. | `0bb0443` |
| 2026-09-10 – 09-11 | **PR #2** — photoreal sock photos (replacing flat SVGs), hero crop, atmosphere/glass, Open Graph image `public/og.png`. | merged `bba948a` |
| 2026-09-16 | **PR #3** — catalog aligned to Printful "Black Foot" sublimated socks. **Superseded.** The photos did not match the black-foot blank that would have shipped. | merged `f7034cc` |
| 2026-09-16 | **PR #4** — image filename fix. Pulse Crew and Glacier Crew 404'd because files did not match slugs. `components/SockPhoto.tsx` loads `/products/{slug}.webp`, so the files that matter are `pulse-crew.webp` and `glacier-crew.webp`. | merged `72610d3` |
| 2026-09-16 | **PR #5** — switch off Printful Black Foot onto **Printify EU sublimation crew socks** (blueprint 496, all-over print, black heel and toe tips) and photos of that blank. | merged `f68a671` |
| 2026-09-16 (owner) / 2026-09-17 (git) | **PR #6** — Stripe Checkout + Printify fulfillment. Owner records the merge as 2026-09-16. The commit on `main` is `7dca31a`, dated 2026-09-17. | `7dca31a` |
| 2026-09-17 | Production Stripe switched to **live** mode (restricted key). Not a code commit. Checkout hit "Permission denied" until `checkout_session_write` was enabled on that key. | env only |

## Leftovers still in the tree

- Product **ids** `pulse-ankle` and `glacier-no-show` remain, with slugs `pulse-crew` and `glacier-crew`. Cart metadata uses the id. `next.config.ts` redirects the old product URLs.
- `public/products/pulse-ankle.webp` and `glacier-no-show.webp` are still on disk (same bytes as the crew files). The UI uses the slug filenames, not these.
- `README.md` deploy section used to quote A-record `10.0.1.2` and a webhook on the apex host. Current DNS and the live webhook host are in [HOSTING_AND_DEPLOY.md](HOSTING_AND_DEPLOY.md).

## What not to resurrect

Printful Black Foot, merino, knee-high, or no-show as the thing we sell. Glacier and Pulse copy still explains they are crews now, on purpose.
