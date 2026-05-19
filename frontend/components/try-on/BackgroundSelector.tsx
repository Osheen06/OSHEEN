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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {eventOptions.map((event) => (
        <button
          key={event.key}
          type="button"
          onClick={() => onChange(event.key)}
          className={cn(
            "focus-ring rounded-[1.25rem] border p-3 text-left transition hover:-translate-y-0.5",
            value === event.key
              ? "border-blush-strong/30 bg-white text-ink shadow-glow"
              : "border-white/70 bg-white/62 text-ink shadow-panel"
          )}
        >
          <span className={cn("mb-4 block h-16 rounded-2xl bg-gradient-to-br", event.accent)} />
          <span className="text-sm font-black">{event.label}</span>
        </button>
      ))}
    </div>
  );
}
