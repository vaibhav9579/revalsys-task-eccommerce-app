import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="mt-auto bg-zinc-950 text-zinc-200">
      <Container>
        <div className="grid gap-8 py-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Store logo"
                width={44}
                height={44}
                sizes="44px"
                className="h-11 w-11 rounded-xl bg-white/5 object-contain p-1"
              />
              <div>
                <p className="text-base font-semibold text-white">Revalsys</p>
                <p className="text-sm text-zinc-400">
                  Smart, reliable, and affordable shopping.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-zinc-400">
              <p>
                Support:{" "}
                <a className="text-zinc-200 hover:underline" href="mailto:support@revalsys.com">
                  support@revalsys.com
                </a>
              </p>
              <p>Hours: Mon–Sat, 9:00 AM – 6:00 PM IST</p>
              <p>Hyderabad, India</p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="Twitter"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.7L5.2 22H2l7.3-8.3L1 2h6.9l4.7 6.1L18.9 2Zm-1.2 18h1.7L6.9 3.9H5.1L17.7 20Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16.5A4.5 4.5 0 1 0 12 7.5a4.5 4.5 0 0 0 0 9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17.7 6.3h.01"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.1 31.1 0 0 0 2 12c0 1.6.1 3.2.4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.6.4-3.2.4-4.8 0-1.6-.1-3.2-.4-4.8ZM10 15V9l6 3-6 3Z" />
                </svg>
              </a>
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-6 md:col-span-5 md:grid-cols-3 md:gap-8"
            aria-label="Footer"
          >
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-white">Shop</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link className="hover:text-white hover:underline" href="/products">
                    All products
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white hover:underline" href="/products">
                    New arrivals
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white hover:underline" href="/products">
                    Best sellers
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white hover:underline" href="/products">
                    Deals
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-white">Company</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link className="hover:text-white hover:underline" href="/about">
                    About us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white hover:underline" href="/contact">
                    Contact
                  </Link>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-white">Help</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Shipping & delivery
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Returns & refunds
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Terms & conditions
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-white">Get deals in your inbox</p>
            <p className="mt-2 text-sm text-zinc-400">
              Subscribe for product updates and special offers. (Mock UI)
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                inputMode="email"
                placeholder="Email address"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              />
              <Button type="button" className="shrink-0">
                Subscribe
              </Button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-white">We accept</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
                {["UPI", "RuPay", "Visa", "Mastercard", "NetBanking"].map((m) => (
                  <span
                    key={m}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Revalsys. All rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Built with Next.js, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
