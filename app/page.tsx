import Link from "next/link";
import { AgentChat } from "@/components/AgentChat";
import { ProductCard } from "@/components/ProductCard";
import { SockPhoto } from "@/components/SockPhoto";
import { featuredSlugs, getProduct, products } from "@/lib/products";

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => getProduct(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const heroSock = getProduct("circuit-crew") ?? products[0];

  return (
    <div>
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <p className="font-mono text-[11px] tracking-[0.32em] text-cyan uppercase">
            01 / Agentic retail
          </p>
          <h1 className="font-display mt-4 text-6xl leading-[0.88] font-extrabold tracking-tight sm:text-8xl">
            <span className="neon-text">NABIL</span>
            <span className="mt-2 block text-white">SOCKS</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            The store that shops with you. Tell Nabil how you move. Walk out in the
            right pair — configured, bagged, demo-checked-out.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-cyan px-6 py-3 text-center font-mono text-[11px] tracking-[0.2em] text-black uppercase"
            >
              Enter the shop
            </Link>
            <Link
              href="/agent"
              className="rounded-full border border-white/14 px-6 py-3 text-center font-mono text-[11px] tracking-[0.2em] uppercase hover:border-cyan/40"
            >
              Talk to Nabil
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-10 rounded-full bg-cyan/12 blur-3xl" />
          <div className="relative aspect-[3/4] w-full">
            <SockPhoto
              product={heroSock}
              priority
              className="drop-shadow-[0_0_40px_rgba(34,240,255,0.16)]"
              sizes="(max-width: 768px) 80vw, 420px"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[11px] tracking-[0.28em] text-magenta uppercase">
            02 / The agent
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
            A conversation is a better aisle.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Nabil is a client-side shopping agent. No API keys. It asks for
            occasion, color, and vibe — every pair is the same Printify EU crew
            blank — then pulls from the live catalog and can add to your bag.
          </p>
        </div>
        <AgentChat teaser />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">
              03 / The grid
            </p>
            <h2 className="font-display mt-2 text-4xl">Featured protocols</h2>
          </div>
          <Link href="/shop" className="font-mono text-[11px] tracking-[0.18em] text-cyan uppercase">
            All pairs →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="glass grid gap-6 rounded-3xl p-6 sm:grid-cols-3 sm:p-8">
          {[
            ["Listen", "Nabil collects signal: night, cyan, quiet, glitch."],
            ["Match", "The catalog is scored, not filtered like a spreadsheet."],
            ["Close", "Bag it. Demo checkout. Fake order id. Zero charge."],
          ].map(([title, copy], i) => (
            <div key={title}>
              <p className="font-mono text-[10px] tracking-[0.24em] text-cyan uppercase">
                0{i + 1}
              </p>
              <h3 className="font-display mt-2 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
