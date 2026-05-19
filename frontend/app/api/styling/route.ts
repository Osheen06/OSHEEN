// frontend/app/api/styling/route.ts

import { NextResponse } from "next/server";
import type { EventKey, MoodKey } from "@/lib/mood";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mood?: MoodKey;
    event?: EventKey;
    outfitName?: string;
  };

  if (!body.mood || !body.event) {
    return NextResponse.json({ message: "Mood and event are required." }, { status: 400 });
  }

  const prompt = `
You are Osheen, an expert AI fashion stylist. A user wants styling advice.

Mood: ${body.mood}
Event: ${body.event}
${body.outfitName ? `Outfit: ${body.outfitName}` : ""}

Respond ONLY with a valid JSON object — no markdown, no explanation, no backticks. Use this exact shape:
{
  "headline": "A punchy, unique 1-line styling headline (max 10 words)",
  "note": "2-3 sentences of specific, actionable styling advice for this mood and event combination",
  "palette": ["color1", "color2", "color3", "color4"],
  "pieces": ["accessory or finish 1", "accessory or finish 2", "accessory or finish 3", "accessory or finish 4"],
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

  if (!res.ok) {
    const err = await res.json();
    console.error("OpenAI error:", err);
    return NextResponse.json({ message: "Styling engine failed." }, { status: 500 });
  }

  const data = await res.json();
  const raw = data.choices[0].message.content as string;

  try {
    const suggestion = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(suggestion);
  } catch {
    console.error("Failed to parse OpenAI response:", raw);
    return NextResponse.json({ message: "Invalid response from styling engine." }, { status: 500 });
  }
}