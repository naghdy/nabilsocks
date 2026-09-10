"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SockPhoto } from "@/components/SockPhoto";
import { formatMaterial, formatHeight } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="group glass relative overflow-hidden rounded-2xl transition hover:border-cyan/35 hover:shadow-[0_0_40px_rgba(34,240,255,0.08)]"
    >
      <Link href={`/product/${product.slug}`} className="block p-4 sm:p-5">
        <div className="relative mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          <span>{formatHeight(product.height)}</span>
          {product.limited ? (
            <span className="rounded-full border border-magenta/40 px-2 py-0.5 text-magenta">
              Limited
            </span>
          ) : (
            <span>{formatMaterial(product.material)}</span>
          )}
        </div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px]">
          <div className="absolute inset-8 rounded-full bg-cyan/8 blur-2xl" />
          <SockPhoto product={product} className="relative" />
        </div>
        <h2 className="font-display mt-2 text-xl tracking-tight">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.tagline}</p>
        <p className="mt-3 font-mono text-sm text-cyan">{formatPrice(product.price)}</p>
      </Link>
    </motion.article>
  );
}
