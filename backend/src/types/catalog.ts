export type ProductMood = "soft" | "bold" | "minimal" | "festive" | "power";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  mood: ProductMood;
  stock: number;
  imageUrl: string;
  createdAt: string;
};

export type CatalogueSummary = {
  totalProducts: number;
  liveListings: number;
  lowStock: number;
  averagePrice: number;
};
