import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative px-4 py-20 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
  align = "center",
  tone = "dark"
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("mx-auto max-w-3xl", align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.28em]", tone === "light" ? "text-blush" : "text-blush-strong")}>{eyebrow}</p>
      ) : null}
      <h2 className={cn("font-display text-3xl font-black leading-tight sm:text-5xl", tone === "light" ? "text-pearl" : "text-ink")}>{title}</h2>
      {copy ? <p className={cn("mt-5 text-base leading-8 sm:text-lg", tone === "light" ? "text-pearl/66" : "text-ink/68")}>{copy}</p> : null}
    </div>
  );
}
