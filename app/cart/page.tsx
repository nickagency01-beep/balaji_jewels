"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { formatPrice, SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const sub = subtotal();
  const shipping = sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = (sub - discount) * TAX_RATE;
  const total = sub - discount + shipping + tax;

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(coupon)}&subtotal=${sub}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid coupon");
      setDiscount(data.discount);
      toast.success(`Coupon applied — you saved ${formatPrice(data.discount)}!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 text-center"
        style={{ background: "var(--pearl)" }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "var(--emerald-fog)" }}
        >
          <ShoppingBag className="w-10 h-10" style={{ color: "var(--emerald-light)" }} />
        </div>
        <h1 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--emerald-deep)" }}>
          Your bag is empty
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--slate)" }}>
          Discover pieces crafted to last a lifetime.
        </p>
        <Link href="/catalog" className="btn-primary inline-flex items-center gap-2">
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1
          className="font-serif text-3xl font-medium mb-2"
          style={{ color: "var(--emerald-deep)" }}
        >
          Shopping Bag
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--slate)" }}>
          {items.reduce((s, i) => s + i.quantity, 0)} items
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <div
              className="rounded-sm overflow-hidden"
              style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
            >
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className={idx > 0 ? "border-t" : ""}
                  style={{ borderColor: "var(--pearl-dark)" }}
                >
                  <div className="flex gap-5 p-5">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div
                        className="w-24 h-28 rounded-sm overflow-hidden"
                        style={{ background: "var(--pearl-mid)" }}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={96}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link href={`/product/${item.slug}`}>
                          <h3
                            className="font-medium text-sm leading-snug hover:text-emerald transition-colors"
                            style={{ color: "var(--ink)" }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="flex-shrink-0 p-1 transition-colors"
                          style={{ color: "var(--slate-light)" }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {item.size && (
                        <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                          Size {item.size}
                        </p>
                      )}
                      {item.engraving && (
                        <p className="text-xs mt-0.5 italic" style={{ color: "var(--slate)" }}>
                          &ldquo;{item.engraving}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div
                          className="flex items-center border rounded-sm"
                          style={{ borderColor: "var(--pearl-dark)" }}
                        >
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                            className="p-2 transition-colors hover:text-emerald"
                            style={{ color: "var(--slate)" }}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                            className="p-2 transition-colors hover:text-emerald"
                            style={{ color: "var(--slate)" }}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-semibold text-sm" style={{ color: "var(--emerald-deep)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="text-xs mt-3 underline underline-offset-2"
              style={{ color: "var(--slate)" }}
            >
              Clear bag
            </button>
          </div>

          {/* Summary */}
          <div>
            <div
              className="rounded-sm p-6 sticky top-24"
              style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
            >
              <h2
                className="font-serif text-lg font-medium mb-5"
                style={{ color: "var(--emerald-deep)" }}
              >
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                    style={{ color: "var(--slate)" }}
                  />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="input-base pl-9 text-xs"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="px-4 text-xs font-semibold uppercase tracking-wide border rounded-sm transition-all hover:bg-emerald hover:text-pearl hover:border-emerald"
                  style={{ borderColor: "var(--emerald)", color: "var(--emerald)" }}
                >
                  {couponLoading ? "…" : "Apply"}
                </button>
              </div>

              {/* Line items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                  <span>Subtotal</span>
                  <span style={{ color: "var(--ink)" }}>{formatPrice(sub)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between" style={{ color: "var(--gold-deep)" }}>
                    <span>Coupon discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                  <span>Shipping</span>
                  <span style={{ color: "var(--ink)" }}>
                    {shipping === 0 ? (
                      <span style={{ color: "var(--emerald)" }}>Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--slate)" }}>
                  <span>Tax (3%)</span>
                  <span style={{ color: "var(--ink)" }}>{formatPrice(tax)}</span>
                </div>
                <div
                  className="pt-3 border-t flex justify-between font-semibold text-base"
                  style={{ borderColor: "var(--pearl-dark)", color: "var(--emerald-deep)" }}
                >
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {sub < SHIPPING_THRESHOLD && (
                <p
                  className="text-xs mt-3 p-2.5 rounded-sm"
                  style={{ background: "var(--emerald-fog)", color: "var(--emerald)" }}
                >
                  Add {formatPrice(SHIPPING_THRESHOLD - sub)} more for free shipping!
                </p>
              )}

              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/catalog"
                className="block text-center text-xs mt-4 underline underline-offset-2"
                style={{ color: "var(--slate)" }}
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
