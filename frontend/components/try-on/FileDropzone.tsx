"use client";

/* eslint-disable @next/next/no-img-element */

import { ImagePlus, Upload, FileCheck } from "lucide-react";
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
        "group focus-ring relative min-h-[12.5rem] w-full overflow-hidden rounded-[2rem] border-2 border-dashed p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm",
        previewUrl 
          ? "border-blush-strong bg-white/70 shadow-md" 
          : "border-clay/20 bg-white/30 hover:border-blush-strong/40 hover:bg-white/60"
      )}
    >
      <input 
        ref={inputRef} 
        type="file" 
        accept="image/*" 
        hidden 
        onChange={(event) => readFile(event.target.files?.[0])} 
      />
      
      {previewUrl ? (
        <div className="absolute inset-0 h-full w-full">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className="h-full w-full object-cover opacity-20 transition-transform duration-500 group-hover:scale-103" 
          />
          {/* Elegant top glass overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[9rem]">
        <div className="flex justify-between items-start">
          <div className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br transition-all duration-500 ease-out group-hover:rotate-3",
            previewUrl 
              ? "from-emerald-500 to-teal-500 text-cream shadow-md" 
              : "from-clay to-blush-strong text-cream"
          )}>
            {previewUrl ? <FileCheck className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
          </div>
          
          {previewUrl && (
            <span className="flex gap-1 items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Selected
            </span>
          )}
        </div>

        <div className="mt-8">
          <p className="text-lg font-black text-ink tracking-tight flex items-center gap-1.5">
            {label}
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink/50">
            {helper}
          </p>
        </div>
      </div>
    </button>
  );
}
