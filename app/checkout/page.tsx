"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { CheckCircle, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatPrice, SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2),
});
type AddressData = z.infer<typeof addressSchema>;

const STEPS = ["Shipping", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const sub = subtotal();
  const shipping = sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = sub * TAX_RATE;
  const total = sub + shipping + tax;

  const { register, handleSubmit, formState: { errors } } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "IN" },
  });

  useEffect(() => {
    if (items.length === 0 && step === 0) router.push("/cart");
  }, [items.length, step, router]);

  async function onAddressSubmit(data: AddressData) {
    setAddress(data);
    setStep(1);
  }

  async function handleRazorpayPayment() {
    if (!address) return;
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create payment");

      const rzp = new window.Razorpay({
        key: json.keyId,
        amount: json.amount,
        currency: json.currency,
        name: "LUMORA",
        description: "Fine Jewelry Purchase",
        order_id: json.orderId,
        prefill: {
          name: user?.name ?? address.fullName,
          email: user?.email ?? "",
          contact: address.phone,
        },
        theme: { color: "#0f3d2e" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const orderRes = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items,
                address,
                subtotal: sub,
                shipping,
                tax,
                total,
                paymentIntentId: response.razorpay_order_id,
              }),
            });
            const orderJson = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderJson.error ?? "Order creation failed");
            setOrderId(orderJson.orderNumber);
            clearCart();
            setStep(2);
          } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Order creation failed");
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });
      rzp.open();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setPaymentLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 text-center">
        <div>
          <h2 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--emerald-deep)" }}>
            Sign in to continue
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>
            You need an account to complete your order.
          </p>
          <Link href="/auth/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Progress */}
          <div className="flex items-center gap-0 mb-12 max-w-sm mx-auto">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all"
                  style={{
                    background: i <= step ? "var(--emerald)" : "var(--pearl-dark)",
                    color: i <= step ? "var(--pearl)" : "var(--slate)",
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1 transition-all"
                    style={{ background: i < step ? "var(--emerald)" : "var(--pearl-dark)" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-sm mx-auto -mt-6 mb-10">
            {STEPS.map((s) => (
              <span key={s} className="text-xs font-medium" style={{ color: "var(--slate)" }}>{s}</span>
            ))}
          </div>

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-sm p-6" style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}>
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Shipping Details
                  </h2>
                  <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>Full Name *</label>
                        <input {...register("fullName")} className="input-base" />
                        {errors.fullName && <p className="text-xs mt-1 text-red-600">{errors.fullName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>Phone *</label>
                        <input {...register("phone")} className="input-base" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>Address Line 1 *</label>
                      <input {...register("line1")} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>Address Line 2</label>
                      <input {...register("line2")} className="input-base" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>City *</label>
                        <input {...register("city")} className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>State *</label>
                        <input {...register("state")} className="input-base" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--ink-light)" }}>PIN Code *</label>
                        <input {...register("postalCode")} className="input-base" />
                      </div>
                    </div>
                    <button type="submit" className="btn-primary flex items-center gap-2 mt-4">
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
              <OrderSummary items={items} sub={sub} shipping={shipping} tax={tax} total={total} />
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-sm p-6" style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}>
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Payment
                  </h2>
                  <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>
                    Shipping to <strong style={{ color: "var(--ink)" }}>{address?.city}, {address?.state}</strong>
                  </p>
                  <div className="rounded-sm p-4 mb-6 text-sm" style={{ background: "var(--emerald-fog)", color: "var(--emerald-deep)" }}>
                    <p className="font-medium mb-1">Secure Payment via Razorpay</p>
                    <p className="text-xs" style={{ color: "var(--slate)" }}>
                      Pay using UPI, Net Banking, Credit/Debit Card, or Wallets. Your payment is secured by bank-level encryption.
                    </p>
                  </div>
                  <button
                    onClick={handleRazorpayPayment}
                    disabled={paymentLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {paymentLoading ? "Opening Payment…" : `Pay ${formatPrice(total)}`}
                  </button>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs mt-4 underline underline-offset-2 block"
                    style={{ color: "var(--slate)" }}
                  >
                    ← Back to shipping
                  </button>
                </div>
              </div>
              <OrderSummary items={items} sub={sub} shipping={shipping} tax={tax} total={total} />
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="text-center max-w-md mx-auto py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--emerald-fog)" }}>
                <CheckCircle className="w-10 h-10" style={{ color: "var(--emerald)" }} />
              </div>
              <h2 className="font-serif text-3xl font-medium mb-3" style={{ color: "var(--emerald-deep)" }}>
                Order Confirmed!
              </h2>
              <p className="text-sm mb-2" style={{ color: "var(--slate)" }}>
                Your order <strong style={{ color: "var(--ink)" }}>#{orderId}</strong> has been placed.
              </p>
              <p className="text-sm mb-8" style={{ color: "var(--slate)" }}>
                We&apos;ve sent a confirmation to your email. Your jewel will be crafted and dispatched within 3–5 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/account/orders" className="btn-primary">View My Orders</Link>
                <Link href="/catalog" className="btn-outline-gold">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function OrderSummary({ items, sub, shipping, tax, total }: {
  items: { name: string; price: number; quantity: number; size?: string }[];
  sub: number; shipping: number; tax: number; total: number;
}) {
  return (
    <div className="rounded-sm p-5 h-fit" style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}>
      <h3 className="font-medium text-sm mb-4" style={{ color: "var(--ink)" }}>Order Summary</h3>
      <div className="space-y-2.5 text-xs mb-4">
        {items.map((i) => (
          <div key={`${i.name}-${i.size}`} className="flex justify-between gap-2">
            <span style={{ color: "var(--slate)" }}>{i.name}{i.size ? ` (${i.size})` : ""} × {i.quantity}</span>
            <span style={{ color: "var(--ink)" }}>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-xs border-t pt-3" style={{ borderColor: "var(--pearl-dark)" }}>
        <div className="flex justify-between"><span style={{ color: "var(--slate)" }}>Subtotal</span><span>{formatPrice(sub)}</span></div>
        <div className="flex justify-between"><span style={{ color: "var(--slate)" }}>Shipping</span><span style={{ color: shipping === 0 ? "var(--emerald)" : undefined }}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
        <div className="flex justify-between"><span style={{ color: "var(--slate)" }}>Tax (3%)</span><span>{formatPrice(tax)}</span></div>
        <div className="flex justify-between font-semibold text-sm pt-1 border-t" style={{ borderColor: "var(--pearl-dark)", color: "var(--emerald-deep)" }}>
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
