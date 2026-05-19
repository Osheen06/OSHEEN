import { NextResponse } from "next/server";
import { createLocalSuggestions, type EventKey, type MoodKey } from "@/lib/mood";

type PreviewBody = {
  mood?: MoodKey;
  event?: EventKey;
  outfitName?: string;
  segmentationUsed?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as PreviewBody;

  if (!body.mood || !body.event) {
    return NextResponse.json({ message: "Mood and event are required." }, { status: 400 });
  }

  return NextResponse.json({
    status: "ready",
    renderMode: body.segmentationUsed ? "body-segmentation-overlay" : "manual-fit-overlay",
    previewId: `osheen-web-${Date.now()}`,
    styling: createLocalSuggestions({ mood: body.mood, event: body.event, outfitName: body.outfitName })
  });
}
