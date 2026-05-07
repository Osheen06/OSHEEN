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
    <section className="noise relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/62 shadow-glass backdrop-blur">
            <Sparkles className="h-4 w-4 text-blush-strong" />
            AI virtual trial room
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.96] text-ink sm:text-7xl lg:text-8xl">
            Your mirror, <span className="ink-gradient">reimagined.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 sm:text-xl">
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
          className="relative min-h-[520px] lg:min-h-[660px]"
        >
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-blush/70 via-white/40 to-pistachio/60 blur-3xl" />
          <div className="glass relative overflow-hidden rounded-[2.5rem] p-3">
            <Image
              src="/assets/osheen-hero.png"
              alt="Confident shopper viewing outfits in an AI styling mirror"
              width={1200}
              height={900}
              priority
              className="h-[520px] w-full rounded-[2rem] object-cover object-center lg:h-[650px]"
            />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
              {heroChips.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-white/45 bg-white/68 p-4 shadow-glass backdrop-blur">
                  <Icon className="mb-3 h-5 w-5 text-blush-strong" />
                  <p className="text-sm font-black text-ink">{label}</p>
                  <p className="mt-1 text-xs text-ink/56">Live demo layer</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
