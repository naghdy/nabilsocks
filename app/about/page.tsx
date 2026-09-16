import type { Metadata } from "next";
import Link from "next/link";
import {
  BLANK_ORIGIN_COPY,
  CARE_COPY,
  FULFILLMENT_COPY,
  MATERIAL_COMPOSITION,
  PRINTIFY_CATALOG_URL,
  PRINTIFY_PROVIDER,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description: "The Nabil Socks story — an agentic storefront for nabilsocks.com.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">
        Transmission
      </p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">
        Socks, then an intelligence.
      </h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
        <p>
          Nabil Socks began as a stubborn idea: the aisle is obsolete. People do
          not want twelve filters. They want a counterpart that already knows
          whether tonight is a boardroom or a burn.
        </p>
        <p>
          The designs are ours — circuit, pulse, flare, void. The physical sock
          is honest: every pair is Printify{" "}
          <a
            href={PRINTIFY_CATALOG_URL}
            className="text-cyan hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Sublimation Crew Socks (EU)
          </a>
          , fulfilled by {PRINTIFY_PROVIDER}. Crew length. {MATERIAL_COMPOSITION}.
          All-over dye sublimation on the ribbed calf and most of the foot; heel
          tip and toe tip remain black. Sizes S, M, and L.
        </p>
        <p>
          Then we put an agent on the floor. Nabil does not replace taste. It
          compresses the search until taste can speak.
        </p>
        <p>
          This site is the public demo for <strong className="text-white">nabilsocks.com</strong>.
          Product specs match the Printify EU blank so photos and listings can
          match a real pair that ships to Switzerland. Checkout is still theater
          until live orders are wired. The feeling is the product: shopping as a
          conversation, staged in neon and glass.
        </p>
      </div>
      <div className="glass mt-10 rounded-3xl p-6">
        <p className="font-mono text-[10px] tracking-[0.24em] text-magenta uppercase">
          Protocol
        </p>
        <p className="mt-3 text-sm text-muted">
          No Stripe keys. No Printify API yet. Cart lives in your browser. When
          the domain points at Vercel, this is what the future of a sock store
          looks like from the street.
        </p>
        <Link
          href="/agent"
          className="mt-5 inline-flex rounded-full bg-cyan px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-black uppercase"
        >
          Meet the agent
        </Link>
      </div>
      <div className="mt-8 space-y-3 text-sm text-muted">
        <h2 className="font-display text-2xl text-white">Fine print</h2>
        <p>{FULFILLMENT_COPY}</p>
        <p>{CARE_COPY}</p>
        <p>{BLANK_ORIGIN_COPY}</p>
      </div>
    </div>
  );
}
