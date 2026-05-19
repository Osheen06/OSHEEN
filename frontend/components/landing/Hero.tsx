"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, HeartHandshake, Sparkles } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { StatPill } from "@/components/ui/StatPill";

const heroChips = [
  { label: "Wedding glow", icon: Camera },
  { label: "Mood match", icon: HeartHandshake },
  { label: "Fit preview", icon: Sparkles }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <div className="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-[2.5rem] sm:inset-x-6 lg:inset-x-8">
        <Image
          src="/assets/osheen-hero.png"
          alt="Confident shopper viewing outfits in an AI styling mirror"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/74 to-cream/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/20" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/62 shadow-panel backdrop-blur">
            <Sparkles className="h-4 w-4 text-blush-strong" />
            AI virtual trial room
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.96] text-ink sm:text-7xl lg:text-8xl">
            Your mirror, <span className="ink-gradient">reimagined.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68 sm:text-xl">
            Stop guessing your style. Upload yourself, test the outfit, switch the moment, and walk into checkout with
            the rarest feeling in fashion: certainty.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/try-on" className="group">
              Try the mirror
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/vendor" variant="secondary">
              Build a digital catalogue
            </ButtonLink>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <StatPill value="3 min" label="first preview" />
            <StatPill value="-returns" label="smarter buys" />
            <StatPill value="24/7" label="safe trial" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative hidden min-h-[620px] lg:block"
        >
          <div className="absolute right-0 top-12 w-72 rounded-[2rem] border border-white/70 bg-white/72 p-5 shadow-aura backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/42">Mirror status</p>
            <p className="mt-3 text-2xl font-black leading-tight text-ink">Outfit confidence is now visible.</p>
            <div className="mt-5 h-2 rounded-full bg-clay/10">
              <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-clay to-blush-strong" />
            </div>
          </div>
          <div className="absolute bottom-10 right-8 grid w-[520px] grid-cols-3 gap-3">
            {heroChips.map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-panel backdrop-blur-xl">
                <Icon className="mb-3 h-5 w-5 text-blush-strong" />
                <p className="text-sm font-black text-ink">{label}</p>
                <p className="mt-1 text-xs text-ink/56">Live MVP layer</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
