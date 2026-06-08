import { Router } from "express";
import { z } from "zod";
import { createStylingSuggestions } from "../services/stylingEngine.js";
import { runVtonTryOn } from "../services/vton.js";

export const tryOnRouter = Router();

const previewSchema = z.object({
  mood: z.enum(["soft", "bold", "minimal", "festive", "power"]),
  event: z.enum(["wedding", "office", "party", "casual"]),
  outfitName: z.string().optional(),
  segmentationUsed: z.boolean().optional(),
  personImage: z.string().optional(),
  garmentImage: z.string().optional()
});

tryOnRouter.post("/preview", async (request, response) => {
  const parsed = previewSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: "Preview metadata is incomplete.", issues: parsed.error.flatten() });
  }

  const { personImage, garmentImage, outfitName } = request.body;
  let vtonImageUrl: string | undefined = undefined;

  if (personImage && garmentImage) {
    try {
      console.log(`[tryon route] Triggering real VTON AI prediction for outfit: ${outfitName}`);
      vtonImageUrl = await runVtonTryOn({
        personImage,
        garmentImage,
        description: outfitName || "a fashionable outfit"
      });
    } catch (error) {
      console.error("[tryon route] VTON prediction failed:", error);
      // We do not throw a 500 here so the frontend can display a clear error message
      // or fall back gracefully. We'll return the response with vtonImageUrl as null or undefined.
    }
  } else {
    console.warn("[tryon route] personImage or garmentImage missing from preview request.");
  }

  const styling = await createStylingSuggestions(parsed.data);

  return response.json({
    status: "ready",
    renderMode: parsed.data.segmentationUsed ? "body-segmentation-overlay" : "geometry-overlay",
    previewId: `osheen-${Date.now()}`,
    styling,
    vtonImageUrl
  });
});
