import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Not found",
  description: "The page you’re looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-zinc-600">
            The page you tried to open doesn’t exist. Use the button below to return home.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button variant="secondary">Go home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

