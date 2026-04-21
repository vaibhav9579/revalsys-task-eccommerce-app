"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim();
}

export function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const searchLower = normalizeText(query);
    const matching = products
      .map((p) => p.name)
      .filter((name) => normalizeText(name).includes(searchLower));

    return Array.from(new Set(matching)).slice(0, 8);
  }, [products, query]);

  // Filter products based on all criteria
  const filtered = useMemo(() => {
    let result = products;

    // Filter by search query
    if (query.trim()) {
      const searchLower = normalizeText(query);
      result = result.filter((product) => {
        const fullText = normalizeText(
          `${product.name} ${product.description} ${product.category}`
        );
        return fullText.includes(searchLower);
      });
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by min price
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        result = result.filter((product) => product.price >= min);
      }
    }

    // Filter by max price
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        result = result.filter((product) => product.price <= max);
      }
    }

    return result;
  }, [products, query, category, minPrice, maxPrice]);

  // Show autocomplete when there are suggestions and the dropdown is open
  const showAutocomplete =
    searchOpen && query.trim().length > 0 && suggestions.length > 0;

  // Track if any filters are active
  const hasFilters =
    query.trim().length > 0 ||
    category !== "all" ||
    minPrice.length > 0 ||
    maxPrice.length > 0;

  // Close autocomplete when clicking outside
  useEffect(() => {
    if (!searchOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      const wrap = searchWrapRef.current;
      if (!wrap) return;
      if (e.target instanceof Node && wrap.contains(e.target)) return;
      setSearchOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside, true);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside, true);
  }, [searchOpen]);

  return (
    <div className="py-10">
      <Container>
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-zinc-600">
            Browse our full catalog. Search by name, filter by category, or narrow by price.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Filters</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Search and refine the product list.
              </p>
            </div>

            {hasFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setMinPrice("");
                  setMaxPrice("");
                  setSearchOpen(false);
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:items-end">
            <div ref={searchWrapRef} className="relative lg:col-span-6">
              <Input
                label="Search"
                id="product-search"
                name="query"
                placeholder="Search by name, category, or description..."
                value={query}
                autoComplete="off"
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(e.target.value.trim().length > 0);
                }}
              />

            {showAutocomplete && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                <div className="border-b border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500">
                  Suggestions
                </div>
                <ul className="max-h-80 overflow-auto">
                  {suggestions.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        className="w-full px-3 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-100"
                        onPointerDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setQuery(name);
                          setSearchOpen(false);
                        }}
                      >
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-sm font-medium leading-none text-zinc-900">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-sm font-medium leading-none text-zinc-900">
              Price range (₹)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                aria-label="Minimum price"
                name="minPrice"
                inputMode="numeric"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                aria-label="Maximum price"
                name="maxPrice"
                inputMode="numeric"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-200 pt-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-medium text-zinc-900">{filtered.length}</span>{" "}
              of <span className="font-medium text-zinc-900">{products.length}</span>{" "}
              product{products.length === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-zinc-500">
              Tip: try “speaker”, “hoodie”, or “electronics”.
            </p>
          </div>
        </section>

        <section className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try adjusting your search or filters.
              </p>
              {hasFilters && (
                <div className="mt-5">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} showAddToCart />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
