import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your payment was successful.",
};

type PageProps = {
  searchParams: Promise<{ payment_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const paymentId = sp.payment_id;

  return (
    <div className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Payment successful</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Thanks for your purchase. Your order has been confirmed.
          </p>
          {paymentId ? (
            <p className="mt-3 text-xs text-zinc-500">
              Payment ID: <span className="font-mono">{paymentId}</span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/products" className="w-full sm:w-auto">
              <Button className="w-full" variant="secondary">
                Continue shopping
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full">Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

