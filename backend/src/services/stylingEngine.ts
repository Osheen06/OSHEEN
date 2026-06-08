// backend/src/services/stylingEngine.ts

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

export async function createStylingSuggestions(input: StylingRequest): Promise<StylingResponse> {
  const prompt = `
You are Osheen, an expert AI fashion stylist.

Mood: ${input.mood}
Event: ${input.event}
${input.outfitName ? `Outfit: ${input.outfitName}` : ""}

Respond ONLY with a valid JSON object — no markdown, no explanation, no backticks:
{
  "headline": "A punchy, unique 1-line styling headline (max 10 words)",
  "note": "2-3 sentences of specific, actionable styling advice for this mood and event combination",
  "palette": ["color1", "color2", "color3", "color4"],
  "pieces": ["piece1", "piece2", "piece3", "piece4"],
  "confidenceScore": <integer between 80 and 98>
}
`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables.");
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API returned status code ${res.status}`);
    }

    const data = await res.json() as any;
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenAI API");
    }

    const raw = data.choices[0].message.content as string;
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.error("[stylingEngine] Error generating styling suggestion, using local fallback recommendation:", err);
    
    // Curated high-quality static recommendations mapped to inputs
    const paletteMap: Record<string, string[]> = {
      wedding: ["#EAD7C3", "#B56E5B", "#7A5043", "#F2E8DF"],
      office: ["#3D4A5E", "#8FA98B", "#E9EEF3", "#171316"],
      party: ["#D95783", "#FFD23F", "#171316", "#FFF8F4"],
      casual: ["#D9AE68", "#8FA98B", "#FFFDF9", "#4F3832"]
    };

    const piecesMap: Record<string, string[]> = {
      wedding: [input.outfitName || "Designer Drape Jacket", "Satin Collar Shirt", "Brocade Loafers", "Gold Accent Ring"],
      office: [input.outfitName || "Tailored Blazer", "Minimal Knit Top", "Pinstripe Trousers", "Sleek Leather Loafers"],
      party: [input.outfitName || "Satin Slip Top", "Metallic Sequined Pants", "Strappy Heel Sandals", "Bold Drop Earrings"],
      casual: [input.outfitName || "Relaxed Shacket", "Premium Cotton Tee", "Relaxed Fit Denim", "Minimal Canvas Trainers"]
    };

    return {
      headline: `The Perfect ${input.mood.toUpperCase()} Blend for this ${input.event.toUpperCase()}`,
      note: `This recommendation leverages a tailored silhouette with the item '${input.outfitName || "selected piece"}'. Combine these colors and fabrics for a refined, modern presentation that expresses ${input.mood} style.`,
      palette: paletteMap[input.event] || ["#171316", "#B56E5B", "#FFF8F4", "#B8D8BA"],
      pieces: piecesMap[input.event] || ["Tailored Outerwear", "Classic Shirt", "Tailored Bottoms", "Premium Shoes"],
      confidenceScore: 94
    };
  }
}