import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/format";
import { getProductById } from "@/utils/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return {
      title: "Product not found",
      description: "This product does not exist.",
    };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return notFound();

  return (
    <div className="py-10">
      <Container>
        <div className="mb-6 text-sm text-zinc-600">
          <Link href="/products" className="hover:underline">
            Products
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-sm text-zinc-600">{product.category}</p>
              <p className="mt-4 text-2xl font-semibold">{formatCurrency(product.price)}</p>
              <p className="mt-4 text-sm leading-6 text-zinc-600">{product.description}</p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="w-full">
                  <AddToCartButton product={product} />
                </div>
                <Link href="/cart" className="text-center text-sm font-medium text-zinc-900 hover:underline">
                  Go to cart
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                <p className="font-medium text-zinc-900">Why you’ll like it</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Responsive, lightweight UI</li>
                  <li>Optimized images via Next.js</li>
                  <li>Persistent cart with localStorage</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
