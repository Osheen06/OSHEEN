import { createLocalSuggestions, type EventKey, type MoodKey, type StylingSuggestion } from "./mood";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export type CatalogueProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  mood: MoodKey;
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

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl ? `${apiBaseUrl}${path}` : path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getStylingSuggestions(input: {
  mood: MoodKey;
  event: EventKey;
  outfitName?: string;
}): Promise<StylingSuggestion> {
  try {
    return await apiFetch<StylingSuggestion>("/api/styling/suggestions", {
      method: "POST",
      body: JSON.stringify(input)
    });
  } catch {
    const response = await fetch("/api/styling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    if (response.ok) {
      return response.json() as Promise<StylingSuggestion>;
    }

    return createLocalSuggestions(input);
  }
}

export async function createTryOnPreview(input: {
  mood: MoodKey;
  event: EventKey;
  outfitName?: string;
  segmentationUsed?: boolean;
  personImage?: string;
  garmentImage?: string;
}) {
  return apiFetch<{
    status: string;
    renderMode: string;
    previewId: string;
    styling: StylingSuggestion;
    vtonImageUrl?: string;
  }>("/api/tryon/preview", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function getProducts(): Promise<{
  products: CatalogueProduct[];
  summary: CatalogueSummary;
}> {
  return apiFetch("/api/catalog/products");
}

export async function createProduct(formData: FormData): Promise<{
  product: CatalogueProduct;
  summary: CatalogueSummary;
}> {
  return apiFetch("/api/catalog/products", {
    method: "POST",
    body: formData
  });
}

export async function sendContact(payload: {
  name: string;
  email: string;
  message: string;
  intent: string;
}) {
  return apiFetch<{ message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
