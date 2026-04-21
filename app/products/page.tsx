import type { Metadata } from "next";
import { ProductsClient } from "@/components/products/ProductsClient";
import { getAllProducts, getCategories } from "@/utils/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products with search and filters.",
};

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getCategories();
  return <ProductsClient products={products} categories={categories} />;
}

