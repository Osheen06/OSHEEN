"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, SlidersHorizontal, WandSparkles, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createTryOnPreview, getStylingSuggestions } from "@/lib/api";
import { starterOutfits } from "@/lib/constants";
import type { EventKey, MoodKey, StylingSuggestion } from "@/lib/mood";
import { createLocalSuggestions } from "@/lib/mood";
import { BackgroundSelector } from "./BackgroundSelector";
import { FileDropzone } from "./FileDropzone";
import { OutfitPicker } from "./OutfitPicker";
import { MoodSelector, SuggestionCard } from "./StylePanel";

export function TryOnStudio() {
  const [userImageUrl, setUserImageUrl] = useState("/assets/demo-person.png");
  const [outfitUrl, setOutfitUrl] = useState<string>(starterOutfits[0].href);
  const [outfitName, setOutfitName] = useState<string>(starterOutfits[0].name);
  const [event, setEvent] = useState<EventKey>("wedding");
  const [mood, setMood] = useState<MoodKey>("soft");
  const [preview, setPreview] = useState<string | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [status, setStatus] = useState("VTON AI Model ready.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [suggestion, setSuggestion] = useState<StylingSuggestion>(() =>
    createLocalSuggestions({ mood: "soft", event: "wedding", outfitName: starterOutfits[0].name })
  );

  const selectedOutfit = useMemo(() => starterOutfits.find((outfit) => outfit.href === outfitUrl), [outfitUrl]);

  async function generatePreview() {
    setIsGenerating(true);
    setElapsedSeconds(0);
    setStatus("Connecting to IDM-VTON model...");
    setPreview(null);
    setCompareMode(false);

    // Start timer counter
    const timerId = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    try {
      const [style, tryOn] = await Promise.allSettled([
        getStylingSuggestions({ mood, event, outfitName }),
        createTryOnPreview({
          mood,
          event,
          outfitName,
          personImage: userImageUrl,
          garmentImage: outfitUrl
        })
      ]);

      // 1. Process Styling Suggestion
      if (style.status === "fulfilled") {
        setSuggestion(style.value);
      } else {
        setSuggestion(createLocalSuggestions({ mood, event, outfitName }));
      }

      // 2. Process VTON try-on output
      if (tryOn.status === "fulfilled" && tryOn.value.vtonImageUrl) {
        setPreview(tryOn.value.vtonImageUrl);
        setBeforePreview(userImageUrl);
        setStatus("Realistic AI Try-On completed successfully!");
      } else {
        const errorReason = tryOn.status === "rejected" 
          ? tryOn.reason?.message 
          : "Hugging Face Space was busy or returned an empty response.";
        setStatus(`Failed to generate: ${errorReason}`);
        throw new Error(errorReason);
      }
    } catch (err: any) {
      console.error("[TryOnStudio] Generation error:", err);
      setStatus(err.message || "Failed to contact VTON engine. Please try again.");
    } finally {
      clearInterval(timerId);
      setIsGenerating(false);
    }
  }

  async function downloadPreview() {
    if (!preview) return;
    try {
      setStatus("Downloading trial image...");
      const response = await fetch(preview);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `osheen-${outfitName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setStatus("Download completed.");
    } catch (e) {
      // Fallback if browser blocks CORS downloads
      window.open(preview, "_blank");
      setStatus("Opening image in new tab...");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-start max-w-7xl mx-auto px-4 sm:px-6">
      {/* Settings / Upload Controls */}
      <div className="space-y-6">
        <div className="soft-panel rounded-[2.5rem] p-6 border border-white/80 bg-white/40 shadow-sm backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-wider text-ink/75">1. Source inputs</p>
            <span className="text-[11px] text-ink/40 font-semibold">JPG/PNG Recommended</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileDropzone 
              label="Your photo" 
              helper="Clear, front-facing model shot" 
              previewUrl={userImageUrl} 
              onFile={(url) => setUserImageUrl(url)} 
            />
            <FileDropzone
              label="Outfit file"
              helper="Garment with clean solid background"
              previewUrl={outfitUrl}
              onFile={(url, file) => {
                setOutfitUrl(url);
                setOutfitName(file.name.replace(/\.[^.]+$/, ""));
              }}
            />
          </div>
        </div>

        <div className="soft-panel rounded-[2.5rem] p-6 border border-white/80 bg-white/40 shadow-sm backdrop-blur-md">
          <p className="mb-4 text-sm font-black uppercase tracking-wider text-ink/75">2. starter collection</p>
          <OutfitPicker
            selected={outfitUrl}
            onSelect={(outfit) => {
              setOutfitUrl(outfit.href);
              setOutfitName(outfit.name);
            }}
          />
        </div>

        <div className="soft-panel rounded-[2.5rem] p-6 border border-white/80 bg-white/40 shadow-sm backdrop-blur-md">
          <p className="mb-4 text-sm font-black uppercase tracking-wider text-ink/75">3. set the background scene</p>
          <BackgroundSelector value={event} onChange={setEvent} />
        </div>

        <div className="soft-panel rounded-[2.5rem] p-6 border border-white/80 bg-white/40 shadow-sm backdrop-blur-md">
          <p className="mb-4 text-sm font-black uppercase tracking-wider text-ink/75">4. choose the style mood</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>
      </div>

      {/* Preview and Loading Screen */}
      <div className="space-y-6">
        <div className="relative rounded-[2.5rem] border border-white/90 bg-white/80 p-4 text-ink shadow-[0_30px_70px_rgba(79,56,50,0.08)] backdrop-blur-md">
          <div className="relative h-[480px] max-h-[480px] aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-cream/20 via-blush/30 to-pistachio/30 border border-clay/10 flex items-center justify-center mx-auto">
            {/* Top glass status bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink/70">IDM-VTON ENGINE 3.0</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-ink/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Identity Preserved
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/80 text-cream backdrop-blur-md z-30"
                >
                  <Loader2 className="h-16 w-16 animate-spin text-blush-strong mb-6" />
                  <p className="text-2xl font-black tracking-widest uppercase">FITTING YOUR OUTFIT</p>
                  <p className="mt-2 text-sm text-cream/70 max-w-xs leading-relaxed">
                    Our AI is warping the garment fabrics and rendering your photo.
                  </p>
                  
                  {/* Elapsed Timer */}
                  <div className="mt-8 flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-xl">
                    <span className="text-[10px] uppercase tracking-widest text-cream/50">Elapsed Time</span>
                    <span className="mt-1 font-mono text-4xl font-extrabold text-blush-strong">
                      {elapsedSeconds}s
                    </span>
                  </div>
                  
                  <div className="mt-6 flex gap-1.5 items-center px-4 py-1.5 rounded-full bg-white/10 text-xs text-cream/70 font-semibold border border-white/5">
                    <span className="relative flex h-2.5 w-2.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Processing on Hugging Face GPU
                  </div>
                </motion.div>
              ) : preview ? (
                compareMode && beforePreview ? (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid h-full w-full gap-1 p-1 sm:grid-cols-2 bg-black/10"
                  >
                    <img src={beforePreview} alt="Original body photograph" className="h-full w-full rounded-[1.75rem] object-contain" />
                    <img src={preview} alt="Styled virtual try-on output" className="h-full w-full rounded-[1.75rem] object-contain" />
                  </motion.div>
                ) : (
                  <motion.img
                    key={preview}
                    src={preview}
                    alt="Generated virtual try-on preview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full object-contain rounded-[2rem]"
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
                  <p className="text-3xl font-black tracking-tight">Fashion should feel certain.</p>
                  <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink/60">
                    Click &quot;Generate preview&quot; to run IDM-VTON AI and see exactly how this clothing fits your body shape.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 p-4 border-t border-clay/10 mt-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink/40 font-bold mb-0.5">Selected Fit</p>
                <p className="text-base font-black text-ink">{selectedOutfit?.name ?? outfitName}</p>
              </div>
              <span className="text-xs text-ink/62 bg-cream border border-clay/10 px-3 py-1 rounded-full font-bold">
                {status}
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row mt-2">
              <Button 
                variant="secondary" 
                onClick={() => setCompareMode((value) => !value)} 
                disabled={!preview}
                className="flex-1 hover:bg-clay/5 active:scale-98 transition-all"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {compareMode ? "Preview only" : "Compare Before/After"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={downloadPreview} 
                disabled={!preview}
                className="flex-1 hover:bg-clay/5 active:scale-98 transition-all"
              >
                <Download className="h-4 w-4" />
                Download Outfit
              </Button>
              <Button 
                onClick={generatePreview} 
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-clay to-blush-strong text-white font-black shadow-lg hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
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
