import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Nabil Socks home"
    >
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-md border border-cyan/40 bg-black/50">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,240,255,0.45),transparent_55%)]" />
        <svg viewBox="0 0 32 32" className="relative h-5 w-5" aria-hidden>
          <path
            d="M9 6h9c2 0 3 1.2 3 3v8c0 1.4.8 2.2 2.2 3.4C25 21.6 26 23 26 25.2 26 27.6 24 29 21.2 29H14c-2.6 0-5-1.8-5-4.4V8c0-1.2.8-2 0-2z"
            fill="none"
            stroke="#22f0ff"
            strokeWidth="1.6"
          />
          <path d="M11 10h8" stroke="#ff2bd6" strokeWidth="1.2" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="font-display block text-[15px] font-semibold tracking-[0.18em]">
          NABIL
        </span>
        <span className="font-mono text-[9px] tracking-[0.38em] text-cyan/80">
          SOCKS
        </span>
      </span>
    </Link>
  );
}
