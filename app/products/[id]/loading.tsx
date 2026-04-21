import { Container } from "@/components/ui/Container";

export default function LoadingProductDetail() {
  return (
    <div className="py-10">
      <Container>
        <div className="h-4 w-64 animate-pulse rounded bg-zinc-200" />

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="aspect-[3/2] animate-pulse rounded-3xl bg-zinc-200" />
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="h-7 w-4/5 animate-pulse rounded bg-zinc-100" />
              <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
              <div className="mt-5 h-7 w-2/5 animate-pulse rounded bg-zinc-100" />
              <div className="mt-5 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-100" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-zinc-100" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

