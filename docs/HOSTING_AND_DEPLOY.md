# Hosting and deploy

## Domain

`nabilsocks.com` is registered at **Namecheap**. DNS is Namecheap Advanced DNS (records point at Vercel). Do not use a Namecheap URL Redirect / forwarding record; that 301s the host and breaks the brand URL and Stripe webhooks.

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

In the Vercel project, **Domains**: apex `nabilsocks.com` **308-redirects to** `www.nabilsocks.com`.

`README.md` used to show a typical A record of `10.0.1.2`. The record in use is `76.76.21.21`. If the Vercel Domains UI ever shows a different target, the UI wins over this file.

## Vercel

| | |
| --- | --- |
| Team | `madar` (slug `madaret`, id `team_b3Bt66swPvYfvEfiAVLSpNHG`) |
| Project | `nabilsocks` (id `prj_SgLKACz2X7I50E3s20EtJhRX8AQh`) |
| Framework Preset | **Next.js** |
| Git | GitHub `naghdy/nabilsocks`. Pushes to `main` auto-deploy **production**. |
| Env changes | Do not apply to existing deployments. Redeploy after changing env vars. |

There is no `vercel.json` in the repo. Framework preset is a project setting in the Vercel dashboard.

A past production deploy returned **404** until Framework Preset was set to Next.js and the project was redeployed. If a new deployment is a 404 while `next build` works locally, check that preset before changing app code.

**Vercel Authentication** (Deployment Protection) is **disabled** so the public can open the site. Do not turn it back on for production; it would put a login wall in front of shoppers and can break Stripe's webhook POST.

## URLs

| URL | Role |
| --- | --- |
| `https://www.nabilsocks.com` | Public production (canonical host after the apex redirect) |
| `https://nabilsocks.com` | Apex; 308 to www |
| `https://nabilsocks.vercel.app` | Vercel project URL |

Stripe webhooks must target the host that does **not** redirect:

`https://www.nabilsocks.com/api/webhooks/stripe`

Stripe does not follow redirects. An endpoint on the apex will not be delivered.

## Open Graph

`app/layout.tsx` sets `metadataBase` to `https://nabilsocks.com` and the share image to `/og.png` (file `public/og.png`, 1280×720, alt "Nabil Socks — Agentic shopping, elevated."). Twitter card is `summary_large_image` using the same image. Favicon is `public/icon.svg`.

`metadataBase` is the apex, while browsers are redirected to www. Crawlers that start from www still request `/og.png` on www because the image path is relative.

## What a production deploy contains

Build command is `npm run build` (`next build`). The build does not call Stripe or Printify. Missing keys fail closed at request time (503), not at build time.
