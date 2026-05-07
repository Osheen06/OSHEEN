import { Router } from "express";
import { z } from "zod";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  intent: z.enum(["demo", "vendor", "investor", "student", "other"]).default("demo")
});

contactRouter.post("/", (request, response) => {
  const parsed = contactSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: "We need a name, real email, and a note to reply well.", issues: parsed.error.flatten() });
  }

  response.status(201).json({
    message: "Message received. Osheen will reply with sparkle and specifics.",
    lead: {
      ...parsed.data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
  });
});
