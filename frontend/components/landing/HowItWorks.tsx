"use client";

import { motion } from "framer-motion";
import { Camera, Images, WandSparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    icon: Camera,
    title: "Bring your real self",
    copy: "Upload a photo from your phone. Osheen reads posture cues and keeps the preview anchored to your body."
  },
  {
    icon: Images,
    title: "Choose the outfit and the moment",
    copy: "Test boutique pieces against wedding, office, party, and casual scenes before the purchase pressure starts."
  },
  {
    icon: WandSparkles,
    title: "Style the feeling",
    copy: "Pick the mood you want to carry. The styling engine returns palettes, pieces, and confidence notes."
  }
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How it works"
        title="See yourself before you buy."
        copy="Osheen turns a shaky shopping guess into a small, visual decision loop: upload, preview, style, breathe."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="lift-card group rounded-[2rem] border border-white/80 bg-white/68 p-7 shadow-panel backdrop-blur"
          >
            <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-clay to-blush-strong text-cream shadow-glow transition group-hover:rotate-3">
              <step.icon className="h-6 w-6" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blush-strong">0{index + 1}</p>
            <h3 className="text-2xl font-black text-ink">{step.title}</h3>
            <p className="mt-4 leading-7 text-ink/64">{step.copy}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
