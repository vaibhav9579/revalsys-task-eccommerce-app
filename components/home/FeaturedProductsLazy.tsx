"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

type FeaturedState =
  | { status: "idle"; items: Product[] }
  | { status: "loading"; items: Product[] }
  | { status: "loaded"; items: Product[] }
  | { status: "error"; items: Product[]; message: string };

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

export function FeaturedProductsLazy({ limit = 6 }: { limit?: number }) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [state, setState] = useState<FeaturedState>({ status: "idle", items: [] });

  const skeletonCount = useMemo(() => Math.max(1, Math.min(12, limit)), [limit]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  async function load() {
    setState((prev) => ({
      status: "loading",
      items: prev.items,
    }));

    try {
      const res = await fetch(`/api/products?featured=1&limit=${limit}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { items?: Product[] };

      const items = Array.isArray(data.items) ? data.items : [];
      setState({ status: "loaded", items });
    } catch (e) {
      setState({
        status: "error",
        items: [],
        message: e instanceof Error ? e.message : "Failed to load featured products",
      });
    }
  }

  useEffect(() => {
    if (!inView) return;
    if (state.status !== "idle") return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (state.status === "error") {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-sm font-medium text-zinc-900">Couldn’t load featured products.</p>
        <p className="mt-1 text-xs text-zinc-500">{state.message}</p>
        <button
          type="button"
          className="mt-4 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
          onClick={() => void load()}
        >
          Retry
        </button>
      </div>
    );
  }

  const showSkeletons = state.status === "idle" || state.status === "loading";

  return (
    <div className="mt-6">
      <div ref={sentinelRef} className="h-px w-full" />
      {showSkeletons ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {state.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
