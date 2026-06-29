import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = 20;

  let query = supabase
    .from("users")
    .select("id, name, email, phone, role, createdAt", { count: "exact" })
    .order("createdAt", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data: customers, count } = await query;

  const enriched = await Promise.all(
    (customers ?? []).map(async (c) => {
      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("userId", c.id)
        .eq("paymentStatus", "PAID");
      return {
        ...c,
        orderCount: orders?.length ?? 0,
        totalSpend: orders?.reduce((s, o) => s + o.total, 0) ?? 0,
      };
    })
  );

  return NextResponse.json({ customers: enriched, total: count ?? 0, page, perPage });
}
