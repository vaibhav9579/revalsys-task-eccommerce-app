"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/format";
import { RazorpayCheckoutButton } from "@/components/checkout/RazorpayCheckoutButton";

export function CartClient() {
  const { items, subtotal, hydrated, increase, decrease, removeItem, clearCart } =
    useCart();

  if (!hydrated) {
    return (
      <div className="py-10">
        <Container>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="h-6 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="mt-4 h-4 w-64 animate-pulse rounded bg-zinc-100" />
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-10">
        <Container>
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Your cart is empty</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Start adding products to see them here.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">
                  Browse products
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Cart</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Review items, update quantities, and see your total.
            </p>
          </div>
          <Button variant="ghost" onClick={clearCart}>
            Clear cart
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-12">
            <div className="space-y-4">
              {items.map((it) => (
                <article
                  key={it.product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row"
                >
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-zinc-50 sm:h-24 sm:w-32">
                    <Image
                      src={it.product.image}
                      alt={it.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link
                          href={`/products/${it.product.id}`}
                          className="font-semibold text-zinc-900 hover:underline"
                        >
                          {it.product.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-zinc-600">
                          {it.product.category}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(it.product.price * it.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => decrease(it.product.id)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </Button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {it.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => increase(it.product.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(it.product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-12">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <RazorpayCheckoutButton />
                <Link href="/products" className="block">
                  <Button variant="secondary" className="w-full">
                    Continue shopping
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Checkout is a mock UI—no payments are processed.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
