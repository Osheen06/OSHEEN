import { Router } from "express";
import { z } from "zod";
import { createStylingSuggestions } from "../services/stylingEngine.js";

export const tryOnRouter = Router();

const previewSchema = z.object({
  mood: z.enum(["soft", "bold", "minimal", "festive", "power"]),
  event: z.enum(["wedding", "office", "party", "casual"]),
  outfitName: z.string().optional(),
  segmentationUsed: z.boolean().optional()
});

tryOnRouter.post("/preview", (request, response) => {
  const parsed = previewSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: "Preview metadata is incomplete.", issues: parsed.error.flatten() });
  }

  const styling = createStylingSuggestions(parsed.data);

  return response.json({
    status: "ready",
    renderMode: parsed.data.segmentationUsed ? "body-segmentation-overlay" : "geometry-overlay",
    previewId: `osheen-${Date.now()}`,
    styling
  });
});
