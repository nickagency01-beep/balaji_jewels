"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#c9a84c",
  CONFIRMED: "#0f3d2e",
  PROCESSING: "#2a7a5a",
  SHIPPED: "#1a5c43",
  DELIVERED: "#16a34a",
  CANCELLED: "#b91c1c",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.replace("/auth/login");
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders?.slice(0, 5) ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="section-eyebrow mb-1">My Account</p>
            <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--emerald-deep)" }}>
              Hello, {user.name.split(" ")[0]}
            </h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm" style={{ color: "var(--slate)" }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Package, label: "My Orders", href: "/account/orders", count: orders.length },
            { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
            { icon: MapPin, label: "Addresses", href: "/account/addresses" },
            { icon: User, label: "Profile", href: "/account/profile" },
          ].map(({ icon: Icon, label, href, count }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-5 rounded-sm text-center transition-all group hover:border-emerald"
              style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-emerald-fog transition-colors"
                style={{ background: "var(--pearl-mid)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "var(--emerald)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{label}</p>
              {count !== undefined && (
                <span className="text-xs" style={{ color: "var(--slate)" }}>{count} items</span>
              )}
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div
          className="rounded-sm overflow-hidden"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--pearl-dark)" }}
          >
            <h2 className="font-medium" style={{ color: "var(--ink)" }}>Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--emerald)" }}
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--pearl-dark)" }} />
              <p className="text-sm" style={{ color: "var(--slate)" }}>No orders yet</p>
              <Link href="/catalog" className="btn-primary inline-block mt-4">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--pearl-dark)" }}>
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                      {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ").slice(0, 50)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--slate-light)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--emerald-deep)" }}>
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                      style={{
                        background: `${STATUS_COLORS[order.status] ?? "#888"}18`,
                        color: STATUS_COLORS[order.status] ?? "#888",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
