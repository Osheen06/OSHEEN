import { NextResponse } from "next/server";
import type { CatalogueProduct, CatalogueSummary } from "@/lib/api";

const starterProducts: CatalogueProduct[] = [
  {
    id: "seed-luna-blazer",
    name: "Luna Glass Blazer",
    price: 3499,
    category: "Outerwear",
    mood: "power",
    stock: 14,
    imageUrl: "/assets/outfits/glass-blazer.svg",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-mehfil-drape",
    name: "Mehfil Sunset Drape",
    price: 5299,
    category: "Festive",
    mood: "festive",
    stock: 8,
    imageUrl: "/assets/outfits/sunset-drape.svg",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-moon-slip",
    name: "Moonlit Slip Set",
    price: 2899,
    category: "Party",
    mood: "bold",
    stock: 19,
    imageUrl: "/assets/outfits/moon-slip.svg",
    createdAt: new Date().toISOString()
  }
];

let products = [...starterProducts];

function summarize(items: CatalogueProduct[]): CatalogueSummary {
  return {
    totalProducts: items.length,
    liveListings: items.filter((item) => item.stock > 0).length,
    lowStock: items.filter((item) => item.stock <= 5).length,
    averagePrice: items.length ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length) : 0
  };
}

export async function GET() {
  return NextResponse.json({ products, summary: summarize(products) });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  let imageUrl = "/assets/outfits/glass-blazer.svg";

  if (file instanceof File && file.size) {
    const bytes = Buffer.from(await file.arrayBuffer());
    imageUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
  }

  const product: CatalogueProduct = {
    id: `web-${Date.now()}`,
    name: String(formData.get("name") ?? "Untitled piece"),
    category: String(formData.get("category") ?? "Catalogue"),
    price: Number(formData.get("price") ?? 0),
    stock: Number(formData.get("stock") ?? 0),
    mood: String(formData.get("mood") ?? "soft") as CatalogueProduct["mood"],
    imageUrl,
    createdAt: new Date().toISOString()
  };

  products = [product, ...products];

  return NextResponse.json({ product, summary: summarize(products) }, { status: 201 });
}
