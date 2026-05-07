export function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-left shadow-glass backdrop-blur">
      <p className="text-2xl font-black text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/52">{label}</p>
    </div>
  );
}
