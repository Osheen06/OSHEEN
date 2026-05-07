"use client";

import { BarChart3, Boxes, IndianRupee, Link2, Sparkles, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductForm } from "@/components/vendor/ProductForm";
import { ProductGrid } from "@/components/vendor/ProductGrid";
import { createProduct, getProducts, type CatalogueProduct, type CatalogueSummary } from "@/lib/api";
import { starterOutfits } from "@/lib/constants";
import { formatINR } from "@/lib/utils";

const fallbackProducts: CatalogueProduct[] = starterOutfits.map((outfit, index) => ({
  id: outfit.href,
  name: outfit.name,
  price: [3499, 5299, 2899][index],
  category: ["Outerwear", "Festive", "Party"][index],
  mood: outfit.mood,
  stock: [14, 8, 19][index],
  imageUrl: outfit.href,
  createdAt: new Date().toISOString()
}));

function summarize(products: CatalogueProduct[]): CatalogueSummary {
  return {
    totalProducts: products.length,
    liveListings: products.filter((product) => product.stock > 0).length,
    lowStock: products.filter((product) => product.stock <= 5).length,
    averagePrice: products.length ? Math.round(products.reduce((sum, product) => sum + product.price, 0) / products.length) : 0
  };
}

export function VendorDashboard() {
  const [products, setProducts] = useState<CatalogueProduct[]>(fallbackProducts);
  const [summary, setSummary] = useState<CatalogueSummary>(() => summarize(fallbackProducts));
  const [apiMode, setApiMode] = useState("Demo catalogue ready");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products);
        setSummary(data.summary);
        setApiMode("Connected to Osheen API");
      })
      .catch(() => setApiMode("Demo mode: backend not reachable yet"));
  }, []);

  const stats = useMemo(
    () => [
      { label: "Live listings", value: summary.liveListings, icon: Store },
      { label: "Products", value: summary.totalProducts, icon: Boxes },
      { label: "Avg price", value: formatINR(summary.averagePrice), icon: IndianRupee },
      { label: "Low stock", value: summary.lowStock, icon: BarChart3 }
    ],
    [summary]
  );

  async function handleCreate(formData: FormData) {
    try {
      const response = await createProduct(formData);
      setProducts((current) => [response.product, ...current]);
      setSummary(response.summary);
      setApiMode("Connected to Osheen API");
      return response.product;
    } catch {
      const file = formData.get("image");
      let imageUrl = "/assets/outfits/glass-blazer.svg";
      if (file instanceof File && file.size) {
        imageUrl = URL.createObjectURL(file);
      }

      const product: CatalogueProduct = {
        id: `local-${Date.now()}`,
        name: String(formData.get("name") ?? "Untitled piece"),
        category: String(formData.get("category") ?? "Catalogue"),
        price: Number(formData.get("price") ?? 0),
        stock: Number(formData.get("stock") ?? 0),
        mood: String(formData.get("mood") ?? "soft") as CatalogueProduct["mood"],
        imageUrl,
        createdAt: new Date().toISOString()
      };
      const nextProducts = [product, ...products];
      setProducts(nextProducts);
      setSummary(summarize(nextProducts));
      setApiMode("Demo mode: saved locally in browser state");
      return null;
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-ink p-6 text-pearl shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-pearl/70">
              <Sparkles className="h-4 w-4 text-blush" />
              {apiMode}
            </p>
            <h2 className="font-display text-3xl font-black leading-tight sm:text-5xl">Your boutique, but searchable by feeling.</h2>
            <p className="mt-4 max-w-2xl leading-8 text-pearl/66">
              Upload pieces, mood-tag them, track stock, and make a catalogue that feels like a stylist is standing beside the customer.
            </p>
          </div>
          <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-pearl px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5">
            <Link2 className="h-4 w-4" />
            Share catalogue
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-white/70 bg-white/64 p-5 shadow-glass backdrop-blur">
            <stat.icon className="mb-6 h-5 w-5 text-blush-strong" />
            <p className="text-2xl font-black text-ink">{stat.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-ink/46">{stat.label}</p>
          </div>
        ))}
      </div>

      <ProductForm onCreate={handleCreate} />
      <ProductGrid products={products} />
    </div>
  );
}
