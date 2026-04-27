"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="aspect-[3/2] w-full animate-pulse bg-zinc-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/5 animate-pulse rounded bg-zinc-100" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-zinc-100" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="flex gap-3 px-4 pb-4">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
}

type ProductsResponse = {
  items?: Product[];
  total?: number;
  suggestions?: string[];
  hasMore?: boolean;
};

function pageSizeForViewport(): number {
  if (typeof window === "undefined") return 9;
  const w = window.innerWidth;
  // Grid is: 1 col (base), 2 cols (sm), 3 cols (lg)
  if (w >= 1024) return 9; // 3 cols x 3 rows
  if (w >= 640) return 6; // 2 cols x 3 rows
  return 6;
}

export function ProductsLazyClient({ categories }: { categories: string[] }) {
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const refreshSeqRef = useRef(0);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [pageSize, setPageSize] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [debouncedMin, setDebouncedMin] = useState(minPrice);
  const [debouncedMax, setDebouncedMax] = useState(maxPrice);

  useEffect(() => {
    const compute = () => setPageSize(pageSizeForViewport());
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedMin(minPrice), 200);
    return () => window.clearTimeout(t);
  }, [minPrice]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedMax(maxPrice), 200);
    return () => window.clearTimeout(t);
  }, [maxPrice]);

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      pageSize,
      q: normalizeText(debouncedQuery),
      category: normalizeText(category),
      min: debouncedMin.trim(),
      max: debouncedMax.trim(),
    });
  }, [pageSize, debouncedQuery, category, debouncedMin, debouncedMax]);

  const hasFilters =
    query.trim().length > 0 ||
    category !== "all" ||
    minPrice.length > 0 ||
    maxPrice.length > 0;

  const showAutocomplete =
    searchOpen && query.trim().length > 0 && suggestions.length > 0;

  async function fetchProductsPage(opts: { offset: number; append: boolean }) {
    if (pageSize == null) return;
    const currentFiltersKey = filtersKey;
    const params = new URLSearchParams();
    params.set("limit", String(pageSize));
    params.set("offset", String(opts.offset));

    if (debouncedQuery.trim()) params.set("q", debouncedQuery);
    if (category !== "all") params.set("category", category);
    if (debouncedMin.trim()) params.set("minPrice", debouncedMin.trim());
    if (debouncedMax.trim()) params.set("maxPrice", debouncedMax.trim());

    try {
      const res = await fetch(`/api/products?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as ProductsResponse;

      if (filtersKey !== currentFiltersKey) return;

      const items = Array.isArray(data.items) ? data.items : [];
      const nextTotal = typeof data.total === "number" ? data.total : 0;
      const nextSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
      const nextHasMore = Boolean(data.hasMore);

      setError(null);
      setTotal(nextTotal);
      setHasMore(nextHasMore);
      setSuggestions(nextSuggestions);
      setProducts((prev) => (opts.append ? [...prev, ...items] : items));
    } catch (e) {
      if (filtersKey !== currentFiltersKey) return;
      setError(e instanceof Error ? e.message : "Failed to load products");
      setHasMore(false);
      if (!opts.append) {
        setProducts([]);
        setTotal(0);
        setSuggestions([]);
      }
    }
  }

  useEffect(() => {
    if (pageSize == null) return;
    refreshSeqRef.current += 1;
    const seq = refreshSeqRef.current;

    setLoading(true);
    setLoadingMore(false);
    setProducts([]);
    setTotal(0);
    setSuggestions([]);
    setHasMore(false);
    setError(null);

    void fetchProductsPage({ offset: 0, append: false }).finally(() => {
      if (refreshSeqRef.current !== seq) return;
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, pageSize]);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;
    if (!hasMore) return;
    if (pageSize == null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (loading || loadingMore) return;
        const seq = refreshSeqRef.current;
        setLoadingMore(true);
        void fetchProductsPage({ offset: products.length, append: true }).finally(() => {
          if (refreshSeqRef.current !== seq) return;
          setLoadingMore(false);
        });
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, products.length, filtersKey, pageSize]);

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

              {showAutocomplete ? (
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
              ) : null}
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
              <span className="font-medium text-zinc-900">{products.length}</span>{" "}
              of <span className="font-medium text-zinc-900">{total}</span>{" "}
              product{total === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-zinc-500">
              Tip: try “speaker”, “hoodie”, or “electronics”.
            </p>
          </div>
        </section>

        <section className="mt-8">
          {error ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold">Couldn’t load products</h2>
              <p className="mt-2 text-sm text-zinc-600">{error}</p>
              <div className="mt-5">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const seq = refreshSeqRef.current;
                    setLoading(true);
                    void fetchProductsPage({ offset: 0, append: false }).finally(() =>
                      refreshSeqRef.current === seq ? setLoading(false) : undefined
                    );
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {Array.from({ length: pageSize ?? 9 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try adjusting your search or filters.
              </p>
              {hasFilters ? (
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
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} showAddToCart />
                ))}
              </div>

              <div ref={loadMoreSentinelRef} className="h-px w-full" />

              {hasMore ? (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="secondary"
                    disabled={loadingMore}
                    onClick={() => {
                      if (loading || loadingMore) return;
                      const seq = refreshSeqRef.current;
                      setLoadingMore(true);
                      void fetchProductsPage({ offset: products.length, append: true }).finally(
                        () => (refreshSeqRef.current === seq ? setLoadingMore(false) : undefined)
                      );
                    }}
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </section>
      </Container>
    </div>
  );
}
