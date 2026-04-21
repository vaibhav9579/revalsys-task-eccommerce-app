import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getFeaturedProducts } from "@/utils/products";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover featured products and explore the full catalog.",
};

export default function Home() {
  const featured = getFeaturedProducts(6);

  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-950 py-14 sm:py-24">
        <Image
          src="/hero_image.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-zinc-50" />

        <Container>
          <div className="relative">
            <div className="max-w-3xl text-left">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                <span className="drop-shadow-[0_3px_12px_rgba(0,0,0,0.75)]">
                  Better Products. Better Prices. Better Experience.
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-200">
                <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
                  Explore a curated set of products with search, filters, and a persistent cart—all
                  powered by local JSON data.
                </span>
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-start">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="light"
                    className="w-full"
                  >
                    Shop products
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="glass"
                    className="w-full"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-start gap-2 text-xs text-zinc-200">
                {["Fast checkout", "Responsive UI", "Secure payments (Razorpay)"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200 bg-white py-12">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Featured products</h2>
              <p className="mt-1 text-sm text-zinc-600">
                A quick look at some favorites. Click any product to see details.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-zinc-900 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
