export type MoodKey = "soft" | "bold" | "minimal" | "festive" | "power";
export type EventKey = "wedding" | "office" | "party" | "casual";

export type StylingSuggestion = {
  headline: string;
  note: string;
  palette: string[];
  pieces: string[];
  confidenceScore: number;
};

const moodBank: Record<MoodKey, Omit<StylingSuggestion, "confidenceScore">> = {
  soft: {
    headline: "Soft confidence, zero second-guessing.",
    note: "Floaty textures, pearl light, and gentle contrast keep the look calm without fading you out.",
    palette: ["rose milk", "shell", "champagne", "warm taupe"],
    pieces: ["sheer stole", "delicate hoops", "dewy blush", "barely-there heels"]
  },
  bold: {
    headline: "Main-character energy, but make it wearable.",
    note: "A strong anchor color and one sculptural accessory give your outfit a clear point of view.",
    palette: ["ink", "cherry", "chrome", "porcelain"],
    pieces: ["statement cuff", "sleek liner", "structured mini bag", "sharp sandal"]
  },
  minimal: {
    headline: "Quiet luxury that still says something.",
    note: "Clean lines and tonal layering make the outfit feel intentional, not plain.",
    palette: ["oat", "black tea", "ivory", "soft graphite"],
    pieces: ["thin belt", "clean bun", "small studs", "matte slingbacks"]
  },
  festive: {
    headline: "Celebration-ready without the chaos.",
    note: "Let one luminous detail lead while the rest of the look stays polished and breathable.",
    palette: ["marigold", "ruby", "antique gold", "jasmine"],
    pieces: ["glow base", "embroidered clutch", "stacked bangles", "soft waves"]
  },
  power: {
    headline: "Walk in like the room already knows.",
    note: "Crisp tailoring, lifted posture, and a focused palette create instant certainty.",
    palette: ["espresso", "bone", "oxblood", "smoke"],
    pieces: ["pointed flats", "watch", "structured tote", "clean lip tint"]
  }
};

const eventNotes: Record<EventKey, string> = {
  wedding: "For a wedding backdrop, keep movement in the fabric and shine near the face.",
  office: "For office mode, lean into crease-proof layers and one elegant texture contrast.",
  party: "For a party setting, add one reflective element so the look catches light beautifully.",
  casual: "For casual plans, soften the styling with comfortable shoes and lived-in hair."
};

export function createLocalSuggestions({
  mood,
  event,
  outfitName
}: {
  mood: MoodKey;
  event: EventKey;
  outfitName?: string;
}): StylingSuggestion {
  const base = moodBank[mood];
  const outfitCue = outfitName ? ` The ${outfitName} looks strongest when the extras stay intentional.` : "";

  return {
    ...base,
    note: `${base.note} ${eventNotes[event]}${outfitCue}`,
    confidenceScore: Math.min(96, 84 + base.palette.length + event.length)
  };
}
