"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/lib/store";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/agent", label: "Agent" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.items.reduce((sum, item) => sum + item.qty, 0));
  const hydrated = useCartStore((s) => s.hydrated);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050508]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[11px] tracking-[0.22em] uppercase transition-colors",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-cyan"
                  : "text-muted hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/agent"
            className="hidden rounded-full border border-cyan/30 bg-cyan/8 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-cyan uppercase sm:inline-flex"
          >
            Talk to Nabil
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full border border-white/12 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase hover:border-cyan/40"
            aria-label={`Cart, ${hydrated ? count : 0} items`}
          >
            Cart
            {hydrated && count > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-magenta px-1 font-mono text-[9px] text-black">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/12 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span className="h-px w-full bg-white" />
              <span className="h-px w-full bg-white" />
              <span className="h-px w-3 bg-white" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/8 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-[0.22em] text-muted uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
