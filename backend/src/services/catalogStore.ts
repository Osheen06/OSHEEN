import { randomUUID } from "node:crypto";
import type { CatalogueSummary, Product } from "../types/catalog.js";

const starterProducts: Product[] = [
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

let products: Product[] = [...starterProducts];

export function listProducts() {
  return products;
}

export function addProduct(product: Omit<Product, "id" | "createdAt">) {
  const nextProduct: Product = {
    ...product,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };

  products = [nextProduct, ...products];
  return nextProduct;
}

export function getCatalogueSummary(): CatalogueSummary {
  const totalProducts = products.length;
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return {
    totalProducts,
    liveListings: products.filter((product) => product.stock > 0).length,
    lowStock: products.filter((product) => product.stock <= 5).length,
    averagePrice: totalProducts ? Math.round(totalPrice / totalProducts) : 0
  };
}
