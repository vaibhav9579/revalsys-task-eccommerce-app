"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginClient() {
  const { user, login, logout } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    if (!touched) return { name: "", email: "" };
    const nameErr = name.trim().length >= 2 ? "" : "Please enter your name (min 2 characters).";
    const emailErr = isValidEmail(email.trim()) ? "" : "Please enter a valid email address.";
    return { name: nameErr, email: emailErr };
  }, [email, name, touched]);

  const canSubmit = name.trim().length >= 2 && isValidEmail(email.trim());
  const guestEmail = "guest@revalsys.com";

  return (
    <div className="py-12">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="mt-2 text-sm text-zinc-600">
            This is a mock login. Your profile is stored in localStorage on this device.
          </p>

          {user ? (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm text-zinc-700">
                Logged in as <span className="font-semibold">{user.name}</span> ({user.email})
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="flex-1">
                  <Button className="w-full">Continue</Button>
                </Link>
                <Button variant="secondary" className="flex-1" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setTouched(true);
                if (!canSubmit) return;
                login({ name: name.trim(), email: email.trim() });
              }}
            >
              <Input
                label="Name"
                name="name"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                error={errors.email}
              />
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                Login
              </Button>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    login({ name: "Guest", email: guestEmail });
                    router.push("/products");
                  }}
                >
                  Continue as guest
                </Button>
                <Link href="/products" className="block">
                  <Button type="button" variant="ghost" className="w-full">
                    Browse without login
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
