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
    <div className="grid gap-4 sm:grid-cols-3">
      {starterOutfits.map((outfit) => {
        const isSelected = selected === outfit.href;
        return (
          <button
            key={outfit.href}
            type="button"
            onClick={() => onSelect(outfit)}
            className={cn(
              "group focus-ring overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 hover:-translate-y-1 bg-white/40 backdrop-blur-sm",
              isSelected 
                ? "border-blush-strong bg-white/90 shadow-[0_12px_30px_rgba(217,87,131,0.12)] ring-1 ring-blush-strong/20" 
                : "border-clay/10 hover:border-blush-strong/30 hover:bg-white/80 hover:shadow-lg"
            )}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.5rem] bg-gradient-to-b from-cream/30 to-blush/20 p-4 flex items-center justify-center">
              <img 
                src={outfit.href} 
                alt={outfit.name} 
                className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108" 
              />
              <span className="absolute top-3 right-3 rounded-full bg-white/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/70 border border-white/50">
                {outfit.tag}
              </span>
            </div>
            <div className="p-4 bg-white/60 rounded-b-[1.75rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush-strong mb-1">
                {outfit.mood} Look
              </p>
              <p className="text-sm font-black text-ink group-hover:text-blush-strong transition-colors leading-snug">
                {outfit.name}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
