"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Analytics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    weeklyRevenue: number;
    weeklyChange: string | null;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
  ordersByDay: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    _sum: { quantity: number | null };
  }>;
  orderStatusCounts: Array<{ status: string; _count: { _all: number } }>;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#c9a84c",
  CONFIRMED: "#0f3d2e",
  PROCESSING: "#2a7a5a",
  SHIPPED: "#1a5c43",
  DELIVERED: "#0a2e20",
  CANCELLED: "#b91c1c",
};

function StatCard({
  icon: Icon, label, value, sub, change, color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  change?: string | null;
  color?: string;
}) {
  const up = change && Number(change) >= 0;
  return (
    <div
      className="rounded-sm p-5"
      style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: color ? `${color}18` : "var(--emerald-fog)" }}
        >
          <Icon className="w-5 h-5" style={{ color: color ?? "var(--emerald)" }} />
        </div>
        {change && (
          <div
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: up ? "var(--emerald)" : "#b91c1c" }}
          >
            {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(Number(change))}%
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--slate)" }}>
        {label}
      </p>
      <p className="text-2xl font-semibold" style={{ color: "var(--emerald-deep)" }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--slate-light)" }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-sm h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-600">Failed to load analytics.</div>;

  const { summary, recentOrders, ordersByDay, topProducts, orderStatusCounts } = data;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-medium" style={{ color: "var(--emerald-deep)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
          Overview of your store's performance
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={formatPrice(summary.totalRevenue)}
          sub={`${formatPrice(summary.weeklyRevenue)} this week`}
          change={summary.weeklyChange}
          color="var(--emerald)"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={String(summary.totalOrders)}
          color="var(--gold-deep)"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={String(summary.totalCustomers)}
          color="var(--emerald-mid)"
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={String(summary.totalProducts)}
          color="var(--emerald-light)"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div
          className="lg:col-span-2 rounded-sm p-5"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <h2 className="font-semibold text-sm mb-5" style={{ color: "var(--ink)" }}>
            Revenue — Last 30 Days
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ordersByDay}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f3d2e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f3d2e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--pearl-dark)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--slate)" }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
              />
              <YAxis tick={{ fontSize: 10, fill: "var(--slate)" }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(v) => formatPrice(Number(v ?? 0))}
                labelFormatter={(l) => new Date(l).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--emerald)" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order status */}
        <div
          className="rounded-sm p-5"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <h2 className="font-semibold text-sm mb-5" style={{ color: "var(--ink)" }}>
            Orders by Status
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderStatusCounts} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="status" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="_count._all" fill="var(--emerald)" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div
          className="rounded-sm"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--pearl-dark)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "var(--ink)" }}>Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs underline underline-offset-2" style={{ color: "var(--emerald)" }}>
              View all
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--pearl-dark)" }}>
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                    {order.user.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "var(--emerald-deep)" }}>
                    {formatPrice(order.total)}
                  </p>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                    style={{
                      background: `${STATUS_COLOR[order.status]}18`,
                      color: STATUS_COLOR[order.status] ?? "var(--slate)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div
          className="rounded-sm"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--pearl-dark)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "var(--ink)" }}>Top Products (30d)</h2>
            <Link href="/admin/products" className="text-xs underline underline-offset-2" style={{ color: "var(--emerald)" }}>
              View all
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--emerald-fog)", color: "var(--emerald)" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
                    {p.productName}
                  </p>
                </div>
                <p className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--emerald-deep)" }}>
                  {p._sum.quantity ?? 0} sold
                </p>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: "var(--slate)" }}>
                No sales data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
