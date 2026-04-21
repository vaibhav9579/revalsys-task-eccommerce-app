"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useUser } from "@/components/providers/UserProvider";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (payload: unknown) => void) => void;
    };
  }
}

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const payloadItems = useMemo(
    () => items.map((it) => ({ productId: it.product.id, quantity: it.quantity })),
    [items]
  );

  const disabled = loading || items.length === 0;

  return (
    <div className="space-y-2">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full"
        disabled={disabled}
        onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const orderRes = await fetch("/api/razorpay/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: payloadItems }),
            });

            if (!orderRes.ok) {
              const text = await orderRes.text();
              throw new Error(text || "Failed to create order");
            }

            const order = (await orderRes.json()) as CreateOrderResponse;
            await loadRazorpayScript();
            if (!window.Razorpay) throw new Error("Razorpay script not available");

            const rzp = new window.Razorpay({
              key: order.keyId,
              amount: order.amount,
              currency: order.currency,
              name: "Revalsys",
              description: "Cart checkout",
              image: "/logo.png",
              order_id: order.orderId,
              prefill: user
                ? {
                    name: user.name,
                    email: user.email,
                  }
                : undefined,
              theme: { color: "#0f172a" },
              handler: async (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
              }) => {
                const verifyRes = await fetch("/api/razorpay/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(response),
                });
                const data = (await verifyRes.json()) as { verified?: boolean };
                if (verifyRes.ok && data.verified) {
                  clearCart();
                  router.push(`/checkout/success?payment_id=${response.razorpay_payment_id}`);
                } else {
                  router.push("/checkout/failed");
                }
              },
              modal: {
                ondismiss: () => {
                  setLoading(false);
                },
              },
            });

            rzp.on("payment.failed", () => {
              router.push("/checkout/failed");
            });

            rzp.open();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Checkout failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Opening Razorpay..." : "Pay with Razorpay"}
      </Button>
      <p className="text-xs text-zinc-500">
        Payments are processed by Razorpay. This demo verifies the signature server-side.
      </p>
    </div>
  );
}

