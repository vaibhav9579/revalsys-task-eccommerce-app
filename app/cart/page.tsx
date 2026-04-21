import type { Metadata } from "next";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart items and total price.",
};

export default function CartPage() {
  return <CartClient />;
}

