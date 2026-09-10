import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export function productImageSrc(product: Product) {
  return `/products/${product.slug}.webp`;
}

type Props = {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function SockPhoto({ product, className, priority, sizes }: Props) {
  return (
    <Image
      src={productImageSrc(product)}
      alt={`${product.name} — ${product.tagline}`}
      width={864}
      height={1152}
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 60vw, 320px"}
      className={cn("h-full w-full object-contain", className)}
    />
  );
}
