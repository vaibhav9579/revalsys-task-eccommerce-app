import { NextResponse } from "next/server";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

export const runtime = "nodejs";

type CreateOrderBody = {
  items?: Array<{ productId?: string; quantity?: number }>;
};

function computeTotalInPaise(items: Array<{ productId: string; quantity: number }>) {
  const products = productsData as Product[];
  const byId = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  for (const it of items) {
    const product = byId.get(it.productId);
    if (!product) {
      throw new Error(`Unknown productId: ${it.productId}`);
    }
    const qty = Math.max(1, Math.min(99, Math.floor(it.quantity)));
    total += product.price * qty;
  }

  // Razorpay expects subunits (paise) as an integer.
  const paise = Math.round(total * 100);
  if (!Number.isFinite(paise) || paise <= 0) {
    throw new Error("Invalid total amount");
  }
  return paise;
}

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Missing Razorpay env vars (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)" },
      { status: 500 }
    );
  }

  let body: CreateOrderBody | null = null;
  try {
    body = (await req.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const itemsInput = Array.isArray(body?.items) ? body!.items! : [];
  const items = itemsInput
    .map((it) => ({
      productId: typeof it.productId === "string" ? it.productId : "",
      quantity: typeof it.quantity === "number" ? it.quantity : 0,
    }))
    .filter((it) => it.productId.length > 0 && it.quantity > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  let amount = 0;
  try {
    amount = computeTotalInPaise(items);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid items" },
      { status: 400 }
    );
  }

  const currency = "INR";
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    }),
    cache: "no-store",
  });

  if (!orderRes.ok) {
    const text = await orderRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Failed to create order", details: text },
      { status: 502 }
    );
  }

  const order = (await orderRes.json()) as { id?: string; amount?: number; currency?: string };
  if (!order.id) {
    return NextResponse.json({ error: "Invalid Razorpay response" }, { status: 502 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount ?? amount,
    currency: order.currency ?? currency,
    keyId,
  });
}

