"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 2000);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  return (
    <Button
      className="w-full"
      onClick={() => {
        addItem(product, 1);
        setJustAdded(true);
        pushToast({
          title: "Added to cart",
          description: product.name,
          variant: "success",
          actionLabel: "View cart",
          actionHref: "/cart",
        });
      }}
    >
      {justAdded ? "Added" : "Add to Cart"}
    </Button>
  );
}
