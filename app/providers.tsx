"use client";

import { CartProvider } from "@/components/providers/CartProvider";
import { UserProvider } from "@/components/providers/UserProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}

