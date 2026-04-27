import { NextResponse } from "next/server";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

export const runtime = "nodejs";

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function parseIntParam(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const rawLimit = parseIntParam(url.searchParams.get("limit"), 12);
  const rawOffset = parseIntParam(url.searchParams.get("offset"), 0);

  const limit = Math.max(1, Math.min(24, rawLimit));
  const offset = Math.max(0, rawOffset);

  const featured = url.searchParams.get("featured") === "1";
  const query = url.searchParams.get("q") ?? "";
  const category = url.searchParams.get("category") ?? "all";
  const minPrice = parseNumberParam(url.searchParams.get("minPrice"));
  const maxPrice = parseNumberParam(url.searchParams.get("maxPrice"));

  const allProducts = productsData as Product[];

  let filtered: Product[] = allProducts;

  if (featured) {
    filtered = allProducts.slice(0, limit);
  } else {
    if (query.trim()) {
      const q = normalizeText(query);
      filtered = filtered.filter((product) => {
        const fullText = normalizeText(
          `${product.name} ${product.description} ${product.category}`
        );
        return fullText.includes(q);
      });
    }

    if (category !== "all") {
      const c = normalizeText(category);
      filtered = filtered.filter(
        (product) => normalizeText(product.category) === c
      );
    }

    if (minPrice != null) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice != null) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }
  }

  const total = filtered.length;

  const suggestions =
    !featured && query.trim()
      ? Array.from(
          new Set(
            filtered
              .map((p) => p.name)
              .filter((name) => normalizeText(name).includes(normalizeText(query)))
          )
        ).slice(0, 8)
      : [];

  const items = featured
    ? filtered
    : filtered.slice(offset, Math.min(offset + limit, total));

  const hasMore = !featured && offset + items.length < total;

  return NextResponse.json(
    {
      items,
      total,
      suggestions,
      offset,
      limit,
      hasMore,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

