import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const perPage = 20;

    let query = supabase
      .from("orders")
      .select("*, user:users(name,email), address:addresses(*), items:order_items(*)", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (status) query = query.eq("status", status);
    if (search) query = query.or(`orderNumber.ilike.%${search}%`);

    const { data: orders, count, error } = await query;
    if (error) throw error;

    return Response.json({ orders: orders ?? [], total: count ?? 0, page, perPage });
  } catch (err) {
    const e = err as Error;
    if (e.message === "Forbidden" || e.message === "Unauthorized") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { orderId, status, trackingNumber } = await req.json();
    const update: Record<string, unknown> = { status };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    const { data: order, error } = await supabase.from("orders").update(update).eq("id", orderId).select().single();
    if (error) throw error;
    return Response.json({ order });
  } catch {
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
