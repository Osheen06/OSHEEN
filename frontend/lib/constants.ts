import type { EventKey, MoodKey } from "./mood";

export const navItems = [
  { label: "Try On", href: "/try-on" },
  { label: "Vendors", href: "/vendor" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export const moodOptions: Array<{ key: MoodKey; label: string; description: string }> = [
  { key: "soft", label: "Soft", description: "gentle, dreamy, low-pressure" },
  { key: "bold", label: "Bold", description: "visible, crisp, electric" },
  { key: "minimal", label: "Minimal", description: "clean, expensive, calm" },
  { key: "festive", label: "Festive", description: "glowy, celebratory, warm" },
  { key: "power", label: "Power", description: "tailored, certain, sharp" }
];

export const eventOptions: Array<{ key: EventKey; label: string; accent: string }> = [
  { key: "wedding", label: "Wedding", accent: "from-[#F7B267] via-[#F7C7D9] to-[#FFF8F4]" },
  { key: "office", label: "Office", accent: "from-[#E9EEF3] via-[#B8D8BA] to-[#FFF8F4]" },
  { key: "party", label: "Party", accent: "from-[#F7C7D9] via-[#D95783] to-[#FFF8F4]" },
  { key: "casual", label: "Casual", accent: "from-[#FFF8F4] via-[#F7C7D9] to-[#B8D8BA]" }
];

export const starterOutfits = [
  {
    name: "Luna Glass Blazer",
    href: "/assets/outfits/glass-blazer.png",
    mood: "power",
    tag: "office"
  },
  {
    name: "Mehfil Sunset Drape",
    href: "/assets/outfits/sunset-drape.png",
    mood: "festive",
    tag: "wedding"
  },
  {
    name: "Moonlit Slip Set",
    href: "/assets/outfits/moon-slip.png",
    mood: "bold",
    tag: "party"
  }
] as const;
