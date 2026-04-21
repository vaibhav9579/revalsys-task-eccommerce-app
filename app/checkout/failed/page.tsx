import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Payment failed",
  description: "Your payment could not be completed.",
};

export default function CheckoutFailedPage() {
  return (
    <div className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Payment failed</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your payment was not completed. Please try again.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/cart" className="w-full sm:w-auto">
              <Button className="w-full">Back to cart</Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button className="w-full" variant="secondary">
                Browse products
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

