"use client";

import { Sparkles, Shirt, Palette, CheckCircle } from "lucide-react";
import { moodOptions } from "@/lib/constants";
import type { MoodKey, StylingSuggestion } from "@/lib/mood";
import { cn } from "@/lib/utils";

export function MoodSelector({
  value,
  onChange
}: {
  value: MoodKey;
  onChange: (value: MoodKey) => void;
}) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
      {moodOptions.map((mood) => {
        const isSelected = value === mood.key;
        return (
          <button
            key={mood.key}
            type="button"
            onClick={() => onChange(mood.key)}
            className={cn(
              "focus-ring rounded-2xl border px-4 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 text-center",
              isSelected
                ? "border-blush-strong bg-gradient-to-r from-clay to-blush-strong text-cream shadow-glow"
                : "border-clay/10 bg-white/50 hover:bg-white/80 text-ink hover:border-blush-strong/30 hover:shadow-md"
            )}
          >
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}

export function SuggestionCard({ suggestion }: { suggestion: StylingSuggestion }) {
  return (
    <aside className="rounded-[2rem] border border-white/90 bg-white/70 p-7 text-ink shadow-[0_20px_50px_rgba(79,56,50,0.06)] backdrop-blur-md relative overflow-hidden">
      {/* Decorative top ambient light */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-blush/40 to-pistachio/30 blur-2xl pointer-events-none" />

      <div className="mb-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-clay to-blush-strong text-cream">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Osheen's Styling Brain</span>
        </div>
        <span className="rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/15 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700">
          {suggestion.confidenceScore}% Match
        </span>
      </div>

      <h3 className="text-2xl font-black leading-tight tracking-tight text-ink border-b border-clay/10 pb-4 mb-4">
        {suggestion.headline}
      </h3>

      <p className="text-sm leading-relaxed text-ink/70">
        {suggestion.note}
      </p>

      {/* Styled Color Swatches */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-blush-strong" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Harmonized Palette</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {suggestion.palette.map((color) => (
            <div key={color} className="flex flex-col items-center gap-1.5 group">
              <div 
                className="h-10 w-10 rounded-full border border-white/90 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-110" 
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[10px] text-ink/40 font-semibold tracking-wider transition-colors group-hover:text-ink/75">
                {color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Complete the Look section */}
      <div className="mt-8 pt-6 border-t border-clay/10">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="h-4 w-4 text-blush-strong" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Finish the styling with</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {suggestion.pieces.map((piece) => (
            <div 
              key={piece} 
              className="flex items-center gap-3 rounded-2xl bg-white/50 border border-white/80 p-3.5 text-sm font-bold text-ink/80 transition-colors hover:bg-white hover:border-blush-strong/20"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>{piece}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
