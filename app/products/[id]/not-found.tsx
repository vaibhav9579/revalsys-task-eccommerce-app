import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ProductNotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Product not found</h1>
          <p className="mt-2 text-sm text-zinc-600">
            This product doesn’t exist (or was removed from the local catalog).
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/products">
              <Button variant="secondary">Back to products</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

