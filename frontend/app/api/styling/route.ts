import { NextResponse } from "next/server";
import { createLocalSuggestions, type EventKey, type MoodKey } from "@/lib/mood";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mood?: MoodKey;
    event?: EventKey;
    outfitName?: string;
  };

  if (!body.mood || !body.event) {
    return NextResponse.json({ message: "Mood and event are required." }, { status: 400 });
  }

  return NextResponse.json(createLocalSuggestions({ mood: body.mood, event: body.event, outfitName: body.outfitName }));
}
