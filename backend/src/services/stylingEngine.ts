import { z } from "zod";

export const stylingRequestSchema = z.object({
  mood: z.enum(["soft", "bold", "minimal", "festive", "power"]),
  event: z.enum(["wedding", "office", "party", "casual"]),
  palette: z.string().optional(),
  outfitName: z.string().optional()
});

export type StylingRequest = z.infer<typeof stylingRequestSchema>;

type StylingResponse = {
  headline: string;
  note: string;
  palette: string[];
  pieces: string[];
  confidenceScore: number;
};

const moodCopy: Record<StylingRequest["mood"], Omit<StylingResponse, "confidenceScore">> = {
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

const eventTweaks: Record<StylingRequest["event"], string> = {
  wedding: "For a wedding backdrop, keep movement in the fabric and shine near the face.",
  office: "For office mode, lean into crease-proof layers and one elegant texture contrast.",
  party: "For a party setting, add one reflective element so the look catches light beautifully.",
  casual: "For casual plans, soften the styling with comfortable shoes and lived-in hair."
};

export function createStylingSuggestions(input: StylingRequest): StylingResponse {
  const base = moodCopy[input.mood];
  const outfitCue = input.outfitName ? ` The ${input.outfitName} works best when the styling stays edited.` : "";

  return {
    ...base,
    note: `${base.note} ${eventTweaks[input.event]}${outfitCue}`,
    confidenceScore: Math.min(96, 82 + base.pieces.length + input.event.length)
  };
}
