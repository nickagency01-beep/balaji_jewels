import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

export async function createPaymentIntent(amountInCents: number, currency = "usd", metadata: Record<string, string> = {}) {
  return stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}
