import { Router } from "express";
import { createStylingSuggestions, stylingRequestSchema } from "../services/stylingEngine.js";

export const stylingRouter = Router();

stylingRouter.post("/suggestions", (request, response) => {
  const parsed = stylingRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: "Tell Osheen the mood and moment so the styling brain can tune in.",
      issues: parsed.error.flatten()
    });
  }

  return response.json(createStylingSuggestions(parsed.data));
});
