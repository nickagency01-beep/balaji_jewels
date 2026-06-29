import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const subtotal = Number(searchParams.get("subtotal") ?? 0);

  if (!code) return Response.json({ error: "Code required" }, { status: 400 });

  try {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("isActive", true)
      .single();

    if (!coupon) return Response.json({ error: "Coupon not found or expired" }, { status: 404 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return Response.json({ error: "Coupon has expired" }, { status: 410 });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return Response.json({ error: "Coupon usage limit reached" }, { status: 410 });
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return Response.json({ error: `Minimum order value is ₹${coupon.minOrderValue / 100} for this coupon` }, { status: 422 });
    }

    const discount = coupon.type === "PERCENTAGE" ? (subtotal * coupon.value) / 100 : coupon.value;
    return Response.json({ discount, type: coupon.type, value: coupon.value });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
