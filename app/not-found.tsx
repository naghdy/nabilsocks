import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-mono text-[11px] tracking-[0.28em] text-magenta uppercase">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl">This pair is off-grid.</h1>
      <p className="mt-3 text-muted">
        The route does not resolve. Return to the shop or ask Nabil to recover the signal.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-cyan px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] text-black uppercase"
        >
          Shop
        </Link>
        <Link
          href="/agent"
          className="rounded-full border border-white/12 px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase"
        >
          Agent
        </Link>
      </div>
    </div>
  );
}
