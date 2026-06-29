import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: paidOrders },
      { count: totalOrders },
      { count: totalCustomers },
      { count: totalProducts },
      { data: recentOrders },
      { data: thisWeekOrders },
      { data: lastWeekOrders },
      { data: orderStatusData },
    ] = await Promise.all([
      supabase.from("orders").select("total").eq("paymentStatus", "PAID"),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "CUSTOMER"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("isActive", true),
      supabase
        .from("orders")
        .select("*, user:users(name,email), items:order_items(*)")
        .order("createdAt", { ascending: false })
        .limit(10),
      supabase.from("orders").select("total").eq("paymentStatus", "PAID").gte("createdAt", sevenDaysAgo),
      supabase
        .from("orders")
        .select("total")
        .eq("paymentStatus", "PAID")
        .gte("createdAt", fourteenDaysAgo)
        .lt("createdAt", sevenDaysAgo),
      supabase.from("orders").select("status"),
    ]);

    const totalRevenue = (paidOrders ?? []).reduce((s, o) => s + o.total, 0);
    const weeklyRevenue = (thisWeekOrders ?? []).reduce((s, o) => s + o.total, 0);
    const prevWeekRevenue = (lastWeekOrders ?? []).reduce((s, o) => s + o.total, 0);
    const weeklyChange = prevWeekRevenue > 0
      ? (((weeklyRevenue - prevWeekRevenue) / prevWeekRevenue) * 100).toFixed(1)
      : null;

    // Group orders by date for chart
    const { data: last30DaysOrders } = await supabase
      .from("orders")
      .select("createdAt, total")
      .eq("paymentStatus", "PAID")
      .gte("createdAt", thirtyDaysAgo);

    const dayMap = new Map<string, { revenue: number; orders: number }>();
    for (const o of last30DaysOrders ?? []) {
      const date = o.createdAt.slice(0, 10);
      const existing = dayMap.get(date) ?? { revenue: 0, orders: 0 };
      dayMap.set(date, { revenue: existing.revenue + o.total, orders: existing.orders + 1 });
    }
    const ordersByDay = Array.from(dayMap.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top products from order_items
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("productId, productName, quantity");
    const productSales = new Map<string, { productName: string; totalQty: number; count: number }>();
    for (const item of orderItems ?? []) {
      const existing = productSales.get(item.productId) ?? { productName: item.productName, totalQty: 0, count: 0 };
      productSales.set(item.productId, { productName: item.productName, totalQty: existing.totalQty + item.quantity, count: existing.count + 1 });
    }
    const topProducts = Array.from(productSales.entries())
      .map(([productId, v]) => ({ productId, ...v }))
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5);

    // Order status counts
    const statusMap = new Map<string, number>();
    for (const o of orderStatusData ?? []) {
      statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
    }
    const orderStatusCounts = Array.from(statusMap.entries()).map(([status, count]) => ({ status, _count: { _all: count } }));

    return Response.json({
      summary: { totalRevenue, totalOrders: totalOrders ?? 0, totalCustomers: totalCustomers ?? 0, totalProducts: totalProducts ?? 0, weeklyRevenue, weeklyChange },
      recentOrders: recentOrders ?? [],
      ordersByDay,
      topProducts,
      orderStatusCounts,
    });
  } catch (err) {
    const e = err as Error;
    if (e.message === "Unauthorized" || e.message === "Forbidden") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Analytics error:", err);
    return Response.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
