import type { Product } from "@/types/product";
import productsData from "@/data/products.json";

export const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(count = 6): Product[] {
  return products.slice(0, Math.max(0, count));
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}

