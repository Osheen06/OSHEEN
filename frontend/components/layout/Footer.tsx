import { Instagram, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-clay/10 bg-cream px-4 py-12 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-clay via-blush-strong to-sage text-cream shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-black">Osheen</p>
              <p className="text-sm text-ink/56">Fashion should feel certain.</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-ink/60">
            An AI-enabled virtual trial room for people who want clarity before checkout, and for boutiques that deserve
            a smarter digital shelf.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-ink/42">Explore</p>
          <div className="grid gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-ink/64 transition hover:text-blush-strong">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-ink/42">Signal</p>
          <div className="flex gap-3">
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-panel transition hover:-translate-y-0.5 hover:text-blush-strong" href="mailto:hello@osheen.local" aria-label="Email Osheen">
              <Mail className="h-5 w-5" />
            </a>
            <a className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-panel transition hover:-translate-y-0.5 hover:text-blush-strong" href="https://instagram.com" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-6 text-xs text-ink/42">Built for demos, competitions, and the first brave users.</p>
        </div>
      </div>
    </footer>
  );
}
