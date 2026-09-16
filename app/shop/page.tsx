import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Nabil Socks catalog — ten crew designs on Printify Sublimation Crew Socks (EU).",
};

export default function ShopPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.28em] text-cyan uppercase">Catalog</p>
      <h1 className="font-display mt-2 text-5xl tracking-tight">The grid</h1>
      <p className="mt-3 max-w-xl text-muted">
        Ten crew designs on one Printify EU blank: all-over sublimation on calf
        and foot, black heel and toe tips, 70% polyester / 25% cotton / 5%
        spandex. Limited drops do not restock.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
