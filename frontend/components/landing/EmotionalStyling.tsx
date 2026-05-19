"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { moodOptions } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";

export function EmotionalStyling() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          align="left"
          eyebrow="Emotional styling"
          title="Not just does it fit. Does it feel like you?"
          copy="Osheen treats style as a mood decision, not a spreadsheet. The recommendation layer translates feelings into palettes, accessories, and tiny confidence rituals."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {moodOptions.map((mood, index) => (
            <motion.div
              key={mood.key}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="lift-card rounded-[1.5rem] border border-white/80 bg-white/68 p-5 shadow-panel backdrop-blur"
            >
              <div className="mb-8 flex items-center justify-between">
                <Heart className="h-5 w-5 text-blush-strong" />
                <Sparkles className="h-4 w-4 text-saffron" />
              </div>
              <p className="text-2xl font-black text-ink">{mood.label}</p>
              <p className="mt-2 text-sm leading-6 text-ink/58">{mood.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
