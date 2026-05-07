"use client";

import { Sparkles } from "lucide-react";
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
    <div className="grid gap-2 sm:grid-cols-5">
      {moodOptions.map((mood) => (
        <button
          key={mood.key}
          type="button"
          onClick={() => onChange(mood.key)}
          className={cn(
            "focus-ring rounded-full border px-4 py-3 text-sm font-black transition hover:-translate-y-0.5",
            value === mood.key ? "border-ink bg-ink text-pearl" : "border-white/70 bg-white/64 text-ink"
          )}
        >
          {mood.label}
        </button>
      ))}
    </div>
  );
}

export function SuggestionCard({ suggestion }: { suggestion: StylingSuggestion }) {
  return (
    <aside className="rounded-[1.5rem] bg-ink p-6 text-pearl shadow-glass">
      <div className="mb-6 flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
          <Sparkles className="h-5 w-5 text-blush" />
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{suggestion.confidenceScore}% match</span>
      </div>
      <h3 className="text-2xl font-black leading-tight">{suggestion.headline}</h3>
      <p className="mt-4 text-sm leading-7 text-pearl/66">{suggestion.note}</p>
      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-pearl/42">Palette</p>
        <div className="flex flex-wrap gap-2">
          {suggestion.palette.map((item) => (
            <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-pearl/80">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-pearl/42">Finish with</p>
        <div className="grid gap-2">
          {suggestion.pieces.map((piece) => (
            <div key={piece} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-pearl/82">
              {piece}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
