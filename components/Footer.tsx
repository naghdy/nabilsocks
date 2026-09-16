import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            Agentic retail for nabilsocks.com. The store listens first, then
            recommends a crew from the Printify EU all-over grid.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-cyan uppercase">
            Navigate
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-muted hover:text-white" href="/shop">
                Shop
              </Link>
            </li>
            <li>
              <Link className="text-muted hover:text-white" href="/agent">
                Agent
              </Link>
            </li>
            <li>
              <Link className="text-muted hover:text-white" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-muted hover:text-white" href="/cart">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-magenta uppercase">
            Fulfillment
          </p>
          <p className="mt-3 text-sm text-muted">
            Specs match Printify Sublimation Crew Socks (EU) — all-over print,
            black heel and toe tips, made in Halle. Pay with Stripe; paid orders
            go to Printify for production.
          </p>
        </div>
      </div>
      <div className="border-t border-white/6">
        <p className="mx-auto max-w-6xl px-4 py-4 font-mono text-[10px] tracking-[0.18em] text-muted uppercase sm:px-6">
          © {new Date().getFullYear()} Nabil Socks · nabilsocks.com · Printify
          EU POD · Stripe Checkout
        </p>
      </div>
    </footer>
  );
}
