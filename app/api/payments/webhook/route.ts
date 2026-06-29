import { NextRequest } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) return Response.json({ error: "Invalid signature" }, { status: 400 });

    await supabase
      .from("orders")
      .update({ paymentStatus: "PAID", status: "CONFIRMED" })
      .eq("paymentIntentId", razorpay_order_id);

    return Response.json({ received: true });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return Response.json({ error: "Webhook error" }, { status: 500 });
  }
}
