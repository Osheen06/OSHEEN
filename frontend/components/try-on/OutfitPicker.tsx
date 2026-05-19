"use client";

/* eslint-disable @next/next/no-img-element */

import { starterOutfits } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function OutfitPicker({
  selected,
  onSelect
}: {
  selected: string;
  onSelect: (outfit: (typeof starterOutfits)[number]) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {starterOutfits.map((outfit) => (
        <button
          key={outfit.href}
          type="button"
          onClick={() => onSelect(outfit)}
          className={cn(
            "focus-ring overflow-hidden rounded-[1.25rem] border bg-white/68 p-3 text-left shadow-panel transition hover:-translate-y-0.5",
            selected === outfit.href ? "border-blush-strong/40 shadow-glow" : "border-white/70"
          )}
        >
          <div className="grid aspect-[4/5] place-items-center rounded-2xl bg-pearl">
            <img src={outfit.href} alt="" className="h-full w-full object-contain p-4" />
          </div>
          <p className="mt-3 text-sm font-black text-ink">{outfit.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/46">{outfit.tag}</p>
        </button>
      ))}
    </div>
  );
}
