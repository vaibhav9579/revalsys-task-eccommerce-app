"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/format";

export function ProductCard({
  product,
  showAddToCart = false,
}: {
  product: Product;
  showAddToCart?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/2] w-full bg-zinc-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4"
            priority={false}
          />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold text-zinc-900">
              {product.name}
            </h3>
            <p className="shrink-0 text-sm font-semibold text-zinc-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          <p className="text-sm text-zinc-600">{product.category}</p>
          <p className="line-clamp-2 text-sm text-zinc-500">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="flex gap-3 px-4 pb-4">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
        >
          View details
        </Link>

        {showAddToCart ? (
          <Button
            type="button"
            className="h-11 flex-1"
            disabled={added}
            onClick={() => {
              addItem(product, 1);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 900);
            }}
          >
            {added ? "Added" : "Add to cart"}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
