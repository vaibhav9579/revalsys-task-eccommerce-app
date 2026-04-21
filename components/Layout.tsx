import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
