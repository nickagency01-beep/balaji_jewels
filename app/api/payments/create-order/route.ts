import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { razorpay } from "@/lib/razorpay";
import { getSession } from "@/lib/auth";
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { items, couponCode } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }

    const productIds = items.map((i: { productId: string }) => i.productId);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, stock")
      .in("id", productIds)
      .eq("isActive", true);

    const productMap = new Map((products ?? []).map((p) => [p.id, p]));
    let subtotal = 0;
    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p) return Response.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      if (p.stock < item.quantity) return Response.json({ error: `Insufficient stock for ${p.name}` }, { status: 400 });
      subtotal += p.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("isActive", true)
        .single();
      if (coupon && (!coupon.minOrderValue || subtotal >= coupon.minOrderValue)) {
        discount = coupon.type === "PERCENTAGE" ? (subtotal * coupon.value) / 100 : coupon.value;
      }
    }

    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = (subtotal - discount) * TAX_RATE;
    // Razorpay amounts are in paise (1 INR = 100 paise)
    const totalPaise = Math.round((subtotal - discount + shipping + tax) * 100);

    const order = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: session.sub, itemCount: String(items.length) },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return Response.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
