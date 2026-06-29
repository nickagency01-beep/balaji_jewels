import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSig === signature;
}
