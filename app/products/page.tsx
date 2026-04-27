import type { Metadata } from "next";
import { ProductsLazyClient } from "@/components/products/ProductsLazyClient";
import { getCategories } from "@/utils/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products with search and filters.",
};

export default function ProductsPage() {
  const categories = getCategories();
  return <ProductsLazyClient categories={categories} />;
}
