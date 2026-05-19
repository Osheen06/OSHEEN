"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, RotateCcw, SlidersHorizontal, WandSparkles } from "lucide-react";
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

type FitControls = {
  scale: number;
  x: number;
  y: number;
  opacity: number;
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
    party: ["#F7C7D9", "#D95783", "#FFF8F4"],
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
    ctx.fillStyle = i % 2 ? "#ffffff" : "#B56E5B";
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

async function renderTryOn({
  userImageUrl,
  outfitUrl,
  event,
  fit
}: {
  userImageUrl: string;
  outfitUrl: string;
  event: EventKey;
  fit: FitControls;
}) {
  const [person, outfit] = await Promise.all([loadImage(userImageUrl), loadImage(outfitUrl)]);
  const segmentation = (await estimatePersonSegmentation(person)) as Segmentation | null;

  const drawScene = (withOutfit: boolean) => {
    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");

    paintBackground(ctx, event, canvas.width, canvas.height);

    const photoBox = { x: 260, y: 24, width: 440, height: 672 };
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 48);
    ctx.clip();
    drawCover(ctx, person, photoBox.x, photoBox.y, photoBox.width, photoBox.height);
    ctx.restore();

    const bounds = segmentationBounds(segmentation, photoBox);
    const torso = bounds ?? {
      x: photoBox.x + photoBox.width * 0.18,
      y: photoBox.y + photoBox.height * 0.24,
      width: photoBox.width * 0.64,
      height: photoBox.height * 0.48
    };

    if (withOutfit) {
      const outfitWidth = Math.min(photoBox.width * 0.76, torso.width * 1.22) * fit.scale;
      const outfitHeight = outfitWidth * 1.18;
      const outfitX = torso.x + torso.width / 2 - outfitWidth / 2 + fit.x;
      const outfitY = torso.y + torso.height * 0.1 + fit.y;

      ctx.save();
      ctx.shadowColor = "rgba(75,52,52,.24)";
      ctx.shadowBlur = 30;
      ctx.globalAlpha = fit.opacity;
      ctx.drawImage(outfit, outfitX, outfitY, outfitWidth, outfitHeight);
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(photoBox.x + 12, photoBox.y + 12, photoBox.width - 24, photoBox.height - 24, 38);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = "#FFFDF9";
    ctx.beginPath();
    ctx.roundRect(58, 578, 260, 80, 28);
    ctx.fill();
    ctx.fillStyle = "#171316";
    ctx.font = "800 20px system-ui";
    ctx.fillText(withOutfit ? "Styled preview" : "Original mirror", 86, 614);
    ctx.font = "600 13px system-ui";
    ctx.fillText(segmentation ? "Body-aware placement" : "Manual fit placement", 86, 640);
    ctx.restore();

    return canvas.toDataURL("image/png");
  };

  return {
    url: drawScene(true),
    beforeUrl: drawScene(false),
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
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready when you are.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [fit, setFit] = useState<FitControls>({ scale: 1, x: 0, y: 0, opacity: 0.86 });
  const [suggestion, setSuggestion] = useState<StylingSuggestion>(() =>
    createLocalSuggestions({ mood: "soft", event: "wedding", outfitName: starterOutfits[0].name })
  );

  const selectedOutfit = useMemo(() => starterOutfits.find((outfit) => outfit.href === outfitUrl), [outfitUrl]);

  async function generatePreview() {
    setIsGenerating(true);
    setStatus("Reading pose cues and styling the moment...");

    try {
      const rendered = await renderTryOn({ userImageUrl, outfitUrl, event, fit });
      setPreview(rendered.url);
      setBeforePreview(rendered.beforeUrl);
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

  function resetFit() {
    setFit({ scale: 1, x: 0, y: 0, opacity: 0.86 });
    setStatus("Fit controls reset. Generate again to refresh the preview.");
  }

  function downloadPreview() {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview;
    link.download = `osheen-${outfitName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.click();
  }

  function updateFit(key: keyof FitControls, value: number) {
    setFit((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <div className="soft-panel rounded-[2rem] p-5">
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

        <div className="soft-panel rounded-[2rem] p-5">
          <p className="mb-4 text-sm font-black text-ink">Starter outfits</p>
          <OutfitPicker
            selected={outfitUrl}
            onSelect={(outfit) => {
              setOutfitUrl(outfit.href);
              setOutfitName(outfit.name);
            }}
          />
        </div>

        <div className="soft-panel rounded-[2rem] p-5">
          <p className="mb-4 text-sm font-black text-ink">Set the scene</p>
          <BackgroundSelector value={event} onChange={setEvent} />
        </div>

        <div className="soft-panel rounded-[2rem] p-5">
          <p className="mb-4 text-sm font-black text-ink">Choose the feeling</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="soft-panel rounded-[2rem] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black text-ink">Fit controls</p>
            <button type="button" onClick={resetFit} className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-ink/64 shadow-panel">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
          <div className="grid gap-4">
            {[
              { key: "scale" as const, label: "Outfit scale", min: 0.78, max: 1.28, step: 0.01, value: fit.scale },
              { key: "x" as const, label: "Move left / right", min: -80, max: 80, step: 1, value: fit.x },
              { key: "y" as const, label: "Move up / down", min: -100, max: 120, step: 1, value: fit.y },
              { key: "opacity" as const, label: "Blend strength", min: 0.45, max: 1, step: 0.01, value: fit.opacity }
            ].map((control) => (
              <label key={control.key} className="grid gap-2 text-sm font-bold text-ink/68">
                <span className="flex items-center justify-between">
                  {control.label}
                  <span className="rounded-full bg-white px-2 py-1 text-xs text-ink/48">
                    {control.key === "opacity" ? `${Math.round(control.value * 100)}%` : control.value.toFixed(control.key === "scale" ? 2 : 0)}
                  </span>
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(event) => updateFit(control.key, Number(event.target.value))}
                  className="accent-blush-strong"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="sticky top-24 rounded-[2rem] border border-white/80 bg-white/70 p-3 text-ink shadow-aura backdrop-blur">
          <div className="relative grid min-h-[520px] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-cream via-blush/70 to-pistachio/80">
            <AnimatePresence mode="wait">
              {preview ? (
                compareMode && beforePreview ? (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid h-full w-full gap-1 p-1 sm:grid-cols-2"
                  >
                    <img src={beforePreview} alt="Original uploaded look before virtual try-on" className="h-full min-h-[520px] w-full rounded-[1.25rem] object-cover" />
                    <img src={preview} alt="Styled virtual try-on preview" className="h-full min-h-[520px] w-full rounded-[1.25rem] object-cover" />
                  </motion.div>
                ) : (
                  <motion.img
                    key={preview}
                    src={preview}
                    alt="Generated virtual try-on preview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 text-center text-ink"
                >
                  <WandSparkles className="mx-auto mb-5 h-12 w-12 text-blush-strong" />
                  <p className="text-3xl font-black">Fashion should feel certain.</p>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-ink/62">
                    Generate a preview to see the outfit, event backdrop, and mood styling together.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div>
              <p className="text-sm font-black">{selectedOutfit?.name ?? outfitName}</p>
              <p className="mt-1 text-xs text-ink/52">{status}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={() => setCompareMode((value) => !value)} disabled={!preview}>
                <SlidersHorizontal className="h-4 w-4" />
                {compareMode ? "Preview only" : "Before / after"}
              </Button>
              <Button variant="secondary" onClick={downloadPreview} disabled={!preview}>
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button onClick={generatePreview} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                Generate preview
              </Button>
            </div>
          </div>
        </div>
        <SuggestionCard suggestion={suggestion} />
      </div>
    </div>
  );
}
