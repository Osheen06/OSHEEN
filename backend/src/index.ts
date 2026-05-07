import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { catalogRouter } from "./routes/catalog.js";
import { contactRouter } from "./routes/contact.js";
import { stylingRouter } from "./routes/styling.js";
import { tryOnRouter } from "./routes/tryon.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json({ limit: "8mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "osheen-api", timestamp: new Date().toISOString() });
});

app.use("/api/catalog", catalogRouter);
app.use("/api/contact", contactRouter);
app.use("/api/styling", stylingRouter);
app.use("/api/tryon", tryOnRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Osheen API route not found." });
});

app.listen(port, () => {
  console.log(`Osheen API is glowing at http://localhost:${port}`);
});
