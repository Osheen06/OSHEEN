import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { addProduct, getCatalogueSummary, listProducts } from "../services/catalogStore.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

const productSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  category: z.string().min(2),
  mood: z.enum(["soft", "bold", "minimal", "festive", "power"]),
  stock: z.coerce.number().int().min(0)
});

export const catalogRouter = Router();

catalogRouter.get("/products", (_request, response) => {
  response.json({
    products: listProducts(),
    summary: getCatalogueSummary()
  });
});

catalogRouter.post("/products", upload.single("image"), (request, response) => {
  const parsed = productSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ message: "Product details need a little more polish.", issues: parsed.error.flatten() });
  }

  const uploadedImage = request.file
    ? `data:${request.file.mimetype};base64,${request.file.buffer.toString("base64")}`
    : "/assets/outfits/glass-blazer.svg";

  const product = addProduct({
    ...parsed.data,
    imageUrl: uploadedImage
  });

  response.status(201).json({ product, summary: getCatalogueSummary() });
});
