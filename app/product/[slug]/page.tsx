import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { SockPhoto } from "@/components/SockPhoto";
import { formatPrice } from "@/lib/format";
import { formatHeight, formatMaterial, getProduct, products } from "@/lib/products";
import {
  BLANK_ORIGIN_COPY,
  CARE_COPY,
  FULFILLMENT_COPY,
  PRINTFUL_CATALOG_URL,
} from "@/lib/types";
import type { Product } from "@/lib/types";

function overlap(base: Product, other: Product) {
  const vibeHits = other.vibe.filter((vibe) => base.vibe.includes(vibe)).length;
  return vibeHits + (other.height === base.height ? 2 : 0) + (other.material === base.material ? 1 : 0);
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Pair not found" };
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((entry) => entry.id !== product.id)
    .sort((a, b) => overlap(product, b) - overlap(product, a))
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
        <Link href="/shop" className="hover:text-cyan">
          Shop
        </Link>{" "}
        / {product.name}
      </p>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <div className="glass relative overflow-hidden rounded-3xl px-4 py-8 sm:px-8">
          <div className="absolute inset-10 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
            <SockPhoto
              product={product}
              priority
              sizes="(max-width: 1024px) 90vw, 480px"
            />
          </div>
        </div>

        <div>
          {product.limited ? (
            <p className="font-mono text-[10px] tracking-[0.24em] text-magenta uppercase">
              Limited drop
            </p>
          ) : (
            <p className="font-mono text-[10px] tracking-[0.24em] text-cyan uppercase">
              In the grid
            </p>
          )}
          <h1 className="font-display mt-2 text-5xl tracking-tight">{product.name}</h1>
          <p className="mt-3 text-lg text-muted">{product.tagline}</p>
          <p className="font-display mt-5 text-3xl text-cyan">{formatPrice(product.price)}</p>
          <p className="mt-5 max-w-lg leading-relaxed text-muted">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="glass rounded-2xl p-3">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                Height
              </dt>
              <dd className="mt-1 capitalize">{formatHeight(product.height)}</dd>
            </div>
            <div className="glass rounded-2xl p-3">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                Material
              </dt>
              <dd className="mt-1">{formatMaterial(product.material)}</dd>
            </div>
            <div className="glass rounded-2xl p-3">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                Print
              </dt>
              <dd className="mt-1">
                Sublimation on the ribbed leg · black cushioned foot
              </dd>
            </div>
            <div className="glass rounded-2xl p-3">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                Sizes
              </dt>
              <dd className="mt-1">M · L · XL</dd>
            </div>
          </dl>

          <div className="mt-8 max-w-sm">
            <AddToCart product={product} />
          </div>

          <div className="mt-8 max-w-lg space-y-3 text-sm text-muted">
            <p>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
                Care
              </span>
              <span className="mt-1 block">{CARE_COPY}</span>
            </p>
            <p>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
                Fulfillment
              </span>
              <span className="mt-1 block">
                {FULFILLMENT_COPY} Base model:{" "}
                {product.printful?.baseModel ?? "Black Foot Sublimated Socks"}.{" "}
                {BLANK_ORIGIN_COPY}{" "}
                <a
                  href={PRINTFUL_CATALOG_URL}
                  className="text-cyan hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Printful catalog
                </a>
                .
              </span>
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Adjacent signal</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((entry, index) => (
            <ProductCard key={entry.id} product={entry} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
