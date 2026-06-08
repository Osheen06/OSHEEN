"use client";

import { eventOptions } from "@/lib/constants";
import type { EventKey } from "@/lib/mood";
import { cn } from "@/lib/utils";

export function BackgroundSelector({
  value,
  onChange
}: {
  value: EventKey;
  onChange: (value: EventKey) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {eventOptions.map((event) => {
        const isSelected = value === event.key;
        return (
          <button
            key={event.key}
            type="button"
            onClick={() => onChange(event.key)}
            className={cn(
              "group focus-ring overflow-hidden rounded-[1.5rem] border p-3.5 text-left transition-all duration-300 hover:-translate-y-1 bg-white/40",
              isSelected
                ? "border-blush-strong bg-white/90 shadow-[0_12px_30px_rgba(217,87,131,0.1)]"
                : "border-clay/10 hover:border-blush-strong/30 hover:bg-white/80 hover:shadow-md"
            )}
          >
            <span 
              className={cn(
                "mb-4 block h-20 rounded-xl bg-gradient-to-br transition-all duration-500 ease-out group-hover:scale-103 shadow-inner", 
                event.accent
              )} 
            />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 block mb-1">
              Scene
            </span>
            <span className="text-sm font-black text-ink group-hover:text-blush-strong transition-colors">
              {event.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
