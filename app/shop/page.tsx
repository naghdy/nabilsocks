import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Nabil Socks catalog — ten crew designs on Printful Black Foot Sublimated Socks.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">Catalog</p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">The grid</h1>
      <p className="mt-3 max-w-xl text-muted">
        Ten crew designs on one Printful blank: black cushioned foot, ribbed
        sublimated leg, 60% nylon / 22% cotton / 18% spandex. Limited drops do
        not restock — this is a demo, but the scarcity still has a tone.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
