import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Math.min(48, Number(searchParams.get("perPage") ?? 24));
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") ?? "featured";
  const metal = searchParams.get("metal");
  const gemstone = searchParams.get("gemstone");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const ids = searchParams.get("ids");

  try {
    let query = supabase
      .from("products")
      .select(`*, images:product_images(*), category:categories(id,name,slug)`, { count: "exact" })
      .eq("isActive", true);

    if (ids) query = query.in("id", ids.split(",").filter(Boolean));
    if (category) query = query.eq("categories.slug", category);
    if (metal) query = query.eq("metalType", metal);
    if (gemstone) query = query.ilike("gemstone", `%${gemstone}%`);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (priceMin) query = query.gte("price", Number(priceMin));
    if (priceMax) query = query.lte("price", Number(priceMax));

    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else if (sort === "newest") query = query.order("createdAt", { ascending: false });
    else query = query.order("isFeatured", { ascending: false });

    const { data: products, error, count } = await query
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return NextResponse.json({ products: products ?? [], total: count ?? 0, page, perPage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products", detail: String(err) }, { status: 500 });
  }
}
