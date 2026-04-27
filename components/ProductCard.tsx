"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
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
  const { pushToast } = useToast();
  const [added, setAdded] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/2] w-full bg-zinc-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
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

      <div className="flex gap-2 px-4 pb-4 sm:gap-3">
        <Link
          href={`/products/${product.id}`}
          aria-label="View details"
          title="View details"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-3 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 sm:h-11 sm:px-4"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="hidden sm:inline">View details</span>
        </Link>

        {showAddToCart ? (
          <Button
            type="button"
            className="h-10 flex-1 px-3 sm:h-11 sm:px-4"
            aria-label="Add to cart"
            disabled={added}
            onClick={() => {
              addItem(product, 1);
              setAdded(true);
              pushToast({
                title: "Added to cart",
                description: product.name,
                variant: "success",
                actionLabel: "View cart",
                actionHref: "/cart",
              });
              window.setTimeout(() => setAdded(false), 900);
            }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6l-2-2H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="hidden sm:inline">{added ? "Added" : "Add to cart"}</span>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
