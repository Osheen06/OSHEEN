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

  const data = await res.json();
  const raw = data.choices[0].message.content as string;
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}