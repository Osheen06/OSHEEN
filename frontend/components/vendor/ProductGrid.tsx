"use client";

/* eslint-disable @next/next/no-img-element */

import { PackageCheck } from "lucide-react";
import type { CatalogueProduct } from "@/lib/api";
import { formatINR } from "@/lib/utils";

export function ProductGrid({ products }: { products: CatalogueProduct[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="lift-card overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/68 shadow-panel backdrop-blur">
          <div className="grid aspect-[4/5] place-items-center bg-pearl">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-6" />
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-gradient-to-r from-clay to-blush-strong px-3 py-1 text-xs font-bold text-cream">{product.mood}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-ink/50">
                <PackageCheck className="h-4 w-4" />
                {product.stock} in stock
              </span>
            </div>
            <h3 className="text-lg font-black text-ink">{product.name}</h3>
            <p className="mt-1 text-sm text-ink/52">{product.category}</p>
            <p className="mt-4 text-2xl font-black text-ink">{formatINR(product.price)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
