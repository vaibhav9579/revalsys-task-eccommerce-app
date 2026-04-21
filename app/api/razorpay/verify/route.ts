import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Missing Razorpay env var (RAZORPAY_KEY_SECRET)" },
      { status: 500 }
    );
  }

  let body: VerifyBody | null = null;
  try {
    body = (await req.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentId = body?.razorpay_payment_id;
  const orderId = body?.razorpay_order_id;
  const signature = body?.razorpay_signature;

  if (!paymentId || !orderId || !signature) {
    return NextResponse.json({ verified: false, error: "Missing fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const signatureBuf = Buffer.from(signature, "utf8");
  const verified =
    expectedBuf.length === signatureBuf.length &&
    crypto.timingSafeEqual(expectedBuf, signatureBuf);

  return NextResponse.json({ verified });
}
