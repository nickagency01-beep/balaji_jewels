import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://balajijewels.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase
    .from("products")
    .select("slug, updatedAt")
    .eq("isActive", true);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/catalog`,       priority: 0.9, changeFrequency: "daily"  },
    { url: `${BASE}/designer`,      priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/contact`,       priority: 0.5, changeFrequency: "yearly" },
  ];

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));

  return [...staticPages, ...productPages];
}
