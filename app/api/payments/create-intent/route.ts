import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createPaymentIntent } from "@/lib/stripe";
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { items, couponCode } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }

    // Verify products and prices server-side
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p) return Response.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      if (p.stock < item.quantity) return Response.json({ error: `Insufficient stock for ${p.name}` }, { status: 400 });
      subtotal += p.price * item.quantity;
    }

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });
      if (coupon) {
        if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
          discount = coupon.type === "PERCENTAGE"
            ? (subtotal * coupon.value) / 100
            : coupon.value;
        }
      }
    }

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = (subtotal - discount) * TAX_RATE;
    const total = Math.round((subtotal - discount + shipping + tax) * 100);

    const intent = await createPaymentIntent(total, "usd", {
      userId: session.sub,
      itemCount: String(items.length),
    });

    return Response.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Payment intent error:", err);
    return Response.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
