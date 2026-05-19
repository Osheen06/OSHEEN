"use client";

import { Loader2, Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { moodOptions } from "@/lib/constants";
import type { CatalogueProduct } from "@/lib/api";

export function ProductForm({
  onCreate
}: {
  onCreate: (formData: FormData) => Promise<CatalogueProduct | null>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("Upload a product and give it a mood.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Publishing product to the catalogue...");
    const form = new FormData(event.currentTarget);
    const product = await onCreate(form);
    if (product) {
      event.currentTarget.reset();
      setStatus(`${product.name} is live in the catalogue.`);
    } else {
      setStatus("Saved locally for demo mode. Start the API to persist products in memory.");
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={submit} className="soft-panel rounded-[2rem] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Product name
          <input name="name" required placeholder="Pearl Hour Co-ord" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 font-medium" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Category
          <input name="category" required placeholder="Festive / Blazer / Dress" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 font-medium" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Price
          <input name="price" required type="number" min="0" placeholder="3499" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 font-medium" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Stock
          <input name="stock" required type="number" min="0" placeholder="12" className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 font-medium" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Mood tag
          <select name="mood" required className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 font-medium">
            {moodOptions.map((mood) => (
              <option key={mood.key} value={mood.key}>
                {mood.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Product image
          <input name="image" type="file" accept="image/*" className="focus-ring rounded-2xl border border-dashed border-ink/14 bg-white px-4 py-3 text-sm" />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-ink/54">{status}</p>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add listing
        </Button>
      </div>
    </form>
  );
}
