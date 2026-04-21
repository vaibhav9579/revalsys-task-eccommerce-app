import { Container } from "@/components/ui/Container";

export default function LoadingProducts() {
  return (
    <div className="py-10">
      <Container>
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="h-11 animate-pulse rounded-xl bg-zinc-100 sm:col-span-6" />
            <div className="h-11 animate-pulse rounded-xl bg-zinc-100 sm:col-span-3" />
            <div className="h-11 animate-pulse rounded-xl bg-zinc-100 sm:col-span-3" />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="aspect-[3/2] animate-pulse bg-zinc-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-100" />
                <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

