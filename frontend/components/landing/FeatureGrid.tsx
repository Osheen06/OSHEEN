"use client";

import { motion } from "framer-motion";
import { Bot, CloudUpload, Leaf, LockKeyhole, Palette, Store } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const features = [
  { title: "AI fit preview", copy: "A working canvas prototype overlays outfits on user photos with optional BodyPix segmentation.", icon: Bot },
  { title: "Mood styling", copy: "Soft, bold, minimal, festive, and power modes create suggestions that feel personal.", icon: Palette },
  { title: "Safer shopping", copy: "Try from your room, your phone, or a boutique kiosk without relying on physical trial rooms.", icon: LockKeyhole },
  { title: "Vendor catalogues", copy: "Boutiques can add products, mood tags, prices, stock, and shareable listings.", icon: Store },
  { title: "Upload-first flow", copy: "Photos and outfit files become instant local previews for fast demos.", icon: CloudUpload },
  { title: "Less return waste", copy: "More confidence before checkout means fewer impulse returns and less logistics drag.", icon: Leaf }
];

export function FeatureGrid() {
  return (
    <Section className="subtle-grid bg-gradient-to-b from-cream via-pearl to-cream">
      <SectionHeader
        eyebrow="Features"
        title="A fashion-tech MVP with a heartbeat."
        copy="The prototype is intentionally light, but the user journey feels real: try-on, styling, catalogue, contact, and backend APIs."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, copy, icon: Icon }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            className="lift-card rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-panel backdrop-blur"
          >
            <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blush to-pistachio text-ink">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-ink">{title}</h3>
            <p className="mt-4 leading-7 text-ink/62">{copy}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
