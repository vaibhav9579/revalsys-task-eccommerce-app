"use client";

import { CartProvider } from "@/components/providers/CartProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UserProvider>
        <CartProvider>{children}</CartProvider>
      </UserProvider>
    </ToastProvider>
  );
}
