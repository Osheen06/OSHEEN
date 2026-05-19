"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, Upload } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function FileDropzone({
  label,
  helper,
  previewUrl,
  onFile
}: {
  label: string;
  helper: string;
  previewUrl?: string;
  onFile: (dataUrl: string, file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function readFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onFile(String(reader.result), file);
    reader.readAsDataURL(file);
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        readFile(event.dataTransfer.files[0]);
      }}
      className={cn(
        "focus-ring group relative min-h-44 overflow-hidden rounded-[1.5rem] border border-dashed border-clay/20 bg-white/66 p-5 text-left shadow-panel transition hover:-translate-y-0.5 hover:bg-white",
        previewUrl && "border-solid border-blush-strong/40"
      )}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => readFile(event.target.files?.[0])} />
      {previewUrl ? (
        <img src={previewUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      ) : null}
      <div className="relative z-10">
        <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-clay to-blush-strong text-cream transition group-hover:rotate-3">
          {previewUrl ? <ImagePlus className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
        </div>
        <p className="text-lg font-black text-ink">{label}</p>
        <p className="mt-2 text-sm leading-6 text-ink/58">{helper}</p>
      </div>
    </button>
  );
}
