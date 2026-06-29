"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  size?: string | null;
  engraving?: string | null;
  imageUrl?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:    { bg: "#c9a84c18", text: "#c9a84c" },
  CONFIRMED:  { bg: "#0f3d2e18", text: "#0f3d2e" },
  PROCESSING: { bg: "#2a7a5a18", text: "#2a7a5a" },
  SHIPPED:    { bg: "#1a5c4318", text: "#1a5c43" },
  DELIVERED:  { bg: "#16a34a18", text: "#16a34a" },
  CANCELLED:  { bg: "#b91c1c18", text: "#b91c1c" },
  REFUNDED:   { bg: "#88888818", text: "#888888" },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) { router.replace("/auth/login"); return; }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="p-2 rounded-sm hover:bg-white transition-colors" style={{ color: "var(--slate)" }}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="section-eyebrow">My Account</p>
            <h1 className="font-serif text-2xl font-medium" style={{ color: "var(--emerald-deep)" }}>Order History</h1>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-sm" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            className="rounded-sm p-16 text-center"
            style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
          >
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--pearl-dark)" }} />
            <p className="font-serif text-lg mb-2" style={{ color: "var(--ink)" }}>No orders yet</p>
            <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>Your order history will appear here once you make a purchase.</p>
            <Link href="/catalog" className="btn-primary">Explore Collection</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const color = STATUS_COLORS[order.status] ?? { bg: "#88888818", text: "#888" };
              const isOpen = expanded === order.id;
              return (
                <div
                  key={order.id}
                  className="rounded-sm overflow-hidden"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                          {new Date(order.createdAt).toLocaleDateString("en", {
                            month: "long", day: "numeric", year: "numeric",
                          })}
                          {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-sm" style={{ color: "var(--emerald-deep)" }}>
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                        style={{ color: "var(--slate-light)" }}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t px-6 py-4 space-y-4" style={{ borderColor: "var(--pearl-dark)" }}>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-14 h-14 object-cover rounded-sm flex-shrink-0"
                              style={{ border: "1px solid var(--pearl-dark)" }}
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-sm flex-shrink-0"
                              style={{ background: "var(--pearl-mid)" }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>
                              {item.productName}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                              SKU: {item.productSku}
                              {item.size ? ` · Size: ${item.size}` : ""}
                              {item.engraving ? ` · "${item.engraving}"` : ""}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium flex-shrink-0" style={{ color: "var(--emerald-deep)" }}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}

                      <div className="pt-3 border-t space-y-1 text-xs" style={{ borderColor: "var(--pearl-dark)", color: "var(--slate)" }}>
                        <div className="flex justify-between">
                          <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between" style={{ color: "#16a34a" }}>
                            <span>Discount</span><span>−{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (GST 3%)</span><span>{formatPrice(order.tax)}</span>
                        </div>
                        <div
                          className="flex justify-between font-semibold pt-1 border-t text-sm"
                          style={{ borderColor: "var(--pearl-dark)", color: "var(--ink)" }}
                        >
                          <span>Total</span><span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
