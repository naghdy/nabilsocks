"use client";

import { useState } from "react";
import { SIZE_GUIDE, SIZES, type Product, type SockSize } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export function AddToCart({
  product,
  compact = false,
  defaultSize = "M",
}: {
  product: Product;
  compact?: boolean;
  defaultSize?: SockSize;
}) {
  const [size, setSize] = useState<SockSize>(defaultSize);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function submit() {
    addItem(product.id, size, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <fieldset>
        <legend className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
          Size
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIZES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={cn(
                "min-w-12 rounded-full border px-3 py-1.5 font-mono text-xs",
                size === option
                  ? "border-cyan bg-cyan/15 text-cyan"
                  : "border-white/12 text-muted hover:border-white/30",
              )}
              aria-pressed={size === option}
            >
              {option}
            </button>
          ))}
        </div>
        {!compact ? (
          <p className="mt-2 text-xs text-muted">{SIZE_GUIDE[size]}</p>
        ) : null}
      </fieldset>

      {!compact ? (
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
            Quantity
          </span>
          <div className="mt-2 inline-flex items-center rounded-full border border-white/12">
            <button
              type="button"
              className="px-3 py-1.5 text-muted"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 text-center font-mono text-sm">{qty}</span>
            <button
              type="button"
              className="px-3 py-1.5 text-muted"
              onClick={() => setQty((n) => Math.min(12, n + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </label>
      ) : null}

      <button
        type="button"
        onClick={submit}
        className="w-full rounded-full bg-cyan px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-black uppercase transition hover:bg-[#6ff7ff]"
      >
        {added ? "Added to bag" : compact ? "Add" : "Add to bag"}
      </button>
    </div>
  );
}
