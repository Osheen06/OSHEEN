"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createTryOnPreview, getStylingSuggestions } from "@/lib/api";
import { starterOutfits } from "@/lib/constants";
import type { EventKey, MoodKey, StylingSuggestion } from "@/lib/mood";
import { createLocalSuggestions } from "@/lib/mood";
import { estimatePersonSegmentation } from "@/lib/vision";
import { BackgroundSelector } from "./BackgroundSelector";
import { FileDropzone } from "./FileDropzone";
import { OutfitPicker } from "./OutfitPicker";
import { MoodSelector, SuggestionCard } from "./StylePanel";

type Segmentation = {
  width: number;
  height: number;
  data: ArrayLike<number>;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function segmentationBounds(segmentation: Segmentation | null, box: { x: number; y: number; width: number; height: number }) {
  if (!segmentation) return null;

  let minX = segmentation.width;
  let minY = segmentation.height;
  let maxX = 0;
  let maxY = 0;
  let points = 0;

  for (let y = 0; y < segmentation.height; y += 2) {
    for (let x = 0; x < segmentation.width; x += 2) {
      if (segmentation.data[y * segmentation.width + x]) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        points++;
      }
    }
  }

  if (points < 300) return null;

  return {
    x: box.x + (minX / segmentation.width) * box.width,
    y: box.y + (minY / segmentation.height) * box.height,
    width: ((maxX - minX) / segmentation.width) * box.width,
    height: ((maxY - minY) / segmentation.height) * box.height
  };
}

function paintBackground(ctx: CanvasRenderingContext2D, event: EventKey, width: number, height: number) {
  const palettes: Record<EventKey, [string, string, string]> = {
    wedding: ["#F7B267", "#F7C7D9", "#FFF8F4"],
    office: ["#E9EEF3", "#B8D8BA", "#FFF8F4"],
    party: ["#171316", "#443066", "#FF73A6"],
    casual: ["#FFF8F4", "#F7C7D9", "#B8D8BA"]
  };
  const [a, b, c] = palettes[event];
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, a);
  gradient.addColorStop(0.52, b);
  gradient.addColorStop(1, c);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.arc(120 + i * 100, 110 + (i % 3) * 160, 74, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? "#ffffff" : "#171316";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

async function renderTryOn({
  userImageUrl,
  outfitUrl,
  event
}: {
  userImageUrl: string;
  outfitUrl: string;
  event: EventKey;
}) {
  const [person, outfit] = await Promise.all([loadImage(userImageUrl), loadImage(outfitUrl)]);
  const segmentation = (await estimatePersonSegmentation(person)) as Segmentation | null;
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  paintBackground(ctx, event, canvas.width, canvas.height);

  const photoBox = { x: 262, y: 28, width: 436, height: 664 };
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 42);
  ctx.clip();
  drawCover(ctx, person, photoBox.x, photoBox.y, photoBox.width, photoBox.height);
  ctx.restore();

  const bounds = segmentationBounds(segmentation, photoBox);
  const torso = bounds ?? {
    x: photoBox.x + photoBox.width * 0.19,
    y: photoBox.y + photoBox.height * 0.24,
    width: photoBox.width * 0.62,
    height: photoBox.height * 0.48
  };

  const outfitWidth = Math.min(photoBox.width * 0.72, torso.width * 1.18);
  const outfitHeight = outfitWidth * 1.18;
  const outfitX = torso.x + torso.width / 2 - outfitWidth / 2;
  const outfitY = torso.y + torso.height * 0.1;

  ctx.save();
  ctx.shadowColor = "rgba(23,19,22,.26)";
  ctx.shadowBlur = 28;
  ctx.globalAlpha = 0.84;
  ctx.drawImage(outfit, outfitX, outfitY, outfitWidth, outfitHeight);
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.lineWidth = 5;
  ctx.strokeRect(photoBox.x + 12, photoBox.y + 12, photoBox.width - 24, photoBox.height - 24);

  ctx.fillStyle = "rgba(255,248,244,.78)";
  ctx.beginPath();
  ctx.roundRect(36, 36, 192, 88, 24);
  ctx.fill();
  ctx.fillStyle = "#171316";
  ctx.font = "800 18px system-ui";
  ctx.fillText(segmentation ? "BodyPix assisted" : "Geometry overlay", 58, 74);
  ctx.font = "600 13px system-ui";
  ctx.fillText("MVP preview", 58, 101);

  return {
    url: canvas.toDataURL("image/png"),
    segmentationUsed: Boolean(segmentation)
  };
}

export function TryOnStudio() {
  const [userImageUrl, setUserImageUrl] = useState("/assets/demo-person.svg");
  const [outfitUrl, setOutfitUrl] = useState<string>(starterOutfits[0].href);
  const [outfitName, setOutfitName] = useState<string>(starterOutfits[0].name);
  const [event, setEvent] = useState<EventKey>("wedding");
  const [mood, setMood] = useState<MoodKey>("soft");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready when you are.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<StylingSuggestion>(() =>
    createLocalSuggestions({ mood: "soft", event: "wedding", outfitName: starterOutfits[0].name })
  );

  const selectedOutfit = useMemo(() => starterOutfits.find((outfit) => outfit.href === outfitUrl), [outfitUrl]);

  async function generatePreview() {
    setIsGenerating(true);
    setStatus("Reading pose cues and styling the moment...");

    try {
      const rendered = await renderTryOn({ userImageUrl, outfitUrl, event });
      setPreview(rendered.url);
      setStatus(rendered.segmentationUsed ? "Body segmentation helped place the outfit." : "Preview used fallback geometry overlay.");

      const [style] = await Promise.allSettled([
        getStylingSuggestions({ mood, event, outfitName }),
        createTryOnPreview({ mood, event, outfitName, segmentationUsed: rendered.segmentationUsed })
      ]);

      if (style.status === "fulfilled") {
        setSuggestion(style.value);
      } else {
        setSuggestion(createLocalSuggestions({ mood, event, outfitName }));
      }
    } catch {
      setStatus("The preview engine hiccuped. Try a clearer photo or another outfit.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
        <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-glass backdrop-blur">
          <p className="mb-4 text-sm font-black text-ink">Upload inputs</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileDropzone label="Your photo" helper="Use a clear full-body or half-body image." previewUrl={userImageUrl} onFile={(url) => setUserImageUrl(url)} />
            <FileDropzone
              label="Outfit file"
              helper="Upload a catalogue piece with a clean background."
              previewUrl={outfitUrl}
              onFile={(url, file) => {
                setOutfitUrl(url);
                setOutfitName(file.name.replace(/\.[^.]+$/, ""));
              }}
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-glass backdrop-blur">
          <p className="mb-4 text-sm font-black text-ink">Starter outfits</p>
          <OutfitPicker
            selected={outfitUrl}
            onSelect={(outfit) => {
              setOutfitUrl(outfit.href);
              setOutfitName(outfit.name);
            }}
          />
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-glass backdrop-blur">
          <p className="mb-4 text-sm font-black text-ink">Set the scene</p>
          <BackgroundSelector value={event} onChange={setEvent} />
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-glass backdrop-blur">
          <p className="mb-4 text-sm font-black text-ink">Choose the feeling</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="sticky top-24 rounded-[2rem] bg-ink p-3 text-pearl shadow-glow">
          <div className="relative grid min-h-[520px] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-pearl via-blush to-pistachio">
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.img
                  key={preview}
                  src={preview}
                  alt="Generated virtual try-on preview"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 text-center text-ink"
                >
                  <WandSparkles className="mx-auto mb-5 h-12 w-12" />
                  <p className="text-3xl font-black">Fashion should feel certain.</p>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-ink/62">
                    Generate a preview to see the outfit, event backdrop, and mood styling together.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black">{selectedOutfit?.name ?? outfitName}</p>
              <p className="mt-1 text-xs text-pearl/54">{status}</p>
            </div>
            <Button variant="dark" onClick={generatePreview} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              Generate preview
            </Button>
          </div>
        </div>
        <SuggestionCard suggestion={suggestion} />
      </div>
    </div>
  );
}
