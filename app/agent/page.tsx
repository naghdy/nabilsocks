import type { Metadata } from "next";
import { AgentChat } from "@/components/AgentChat";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Agent",
  description: "Talk to Nabil — a client-side shopping agent for the sock grid.",
};

export default function AgentPage() {
  const limited = products.filter((product) => product.limited);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">
          Neural aisle
        </p>
        <h1 className="font-display mt-2 text-5xl tracking-tight">Talk to Nabil</h1>
        <p className="mt-3 max-w-xl text-muted">
          Scripted, catalog-aware, and a little cinematic. Ask for a night out,
          quiet merino, a glitch, or say add Circuit Crew. Nothing leaves the
          browser.
        </p>
        <div className="mt-8">
          <AgentChat />
        </div>
      </div>
      <aside className="space-y-4 lg:pt-24">
        <p className="font-mono text-[10px] tracking-[0.24em] text-magenta uppercase">
          Live limited
        </p>
        {limited.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </aside>
    </div>
  );
}
