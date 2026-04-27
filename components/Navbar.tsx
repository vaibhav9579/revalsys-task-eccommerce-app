"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useUser } from "@/components/providers/UserProvider";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
        }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { totalItems, hydrated: cartHydrated } = useCart();
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cartHydrated ? totalItems : 0;
  const userLabel = user ? user.name : "Login";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-100 sm:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>

            <Link
              href="/"
              className="inline-flex items-center rounded-xl px-2 py-1 transition hover:bg-zinc-100"
              aria-label="Home"
            >
              <Image
                src="/logo.png"
                alt="Store logo"
                width={180}
                height={48}
                sizes="(max-width: 640px) 140px, 180px"
                className="h-10 w-auto max-w-[140px] object-contain sm:h-11 sm:max-w-[180px]"
                priority
              />
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/products">Products</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              aria-label="Cart"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-zinc-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6l-2-2H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span>Cart</span>
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-zinc-600 sm:inline">
                  Hi, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  <span className="inline-flex items-center gap-2">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="8" r="4" />
                    </svg>
                    <span>{userLabel}</span>
                  </span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`sm:hidden ${mobileOpen ? "pb-3" : "hidden"}`}
        >
          <div className="relative z-40 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
            <div className="space-y-1 p-2">
              <MobileNavLink href="/" onNavigate={() => setMobileOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/products" onNavigate={() => setMobileOpen(false)}>
                Products
              </MobileNavLink>
              <MobileNavLink href="/about" onNavigate={() => setMobileOpen(false)}>
                About
              </MobileNavLink>
              <MobileNavLink href="/contact" onNavigate={() => setMobileOpen(false)}>
                Contact
              </MobileNavLink>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
