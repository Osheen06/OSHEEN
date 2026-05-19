"use client";

import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-clay/10 bg-cream/82 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-clay via-blush-strong to-sage text-cream shadow-glow">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-lg font-black leading-none">Osheen</span>
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-ink/50">AI styling mirror</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-clay/10 bg-white/62 p-1 shadow-panel backdrop-blur lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring rounded-full px-4 py-2 text-sm font-semibold text-ink/64 transition hover:bg-pearl hover:text-ink",
                pathname === item.href && "bg-gradient-to-r from-clay to-blush-strong text-cream shadow-glow hover:text-cream"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/vendor" variant="secondary">
            Vendor demo
          </ButtonLink>
          <ButtonLink href="/try-on">Try the mirror</ButtonLink>
        </div>

        <button
          className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/78 text-ink shadow-panel lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-clay/10 bg-white/88 p-3 shadow-glass backdrop-blur lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70",
                pathname === item.href && "bg-gradient-to-r from-clay to-blush-strong text-cream"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/try-on" className="mt-3 w-full" onClick={() => setOpen(false)}>
            Try the mirror
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
