import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name, metaTitle, metaDesc, description, images:product_images(url)")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  const title = product.metaTitle ?? product.name;
  const description = product.metaDesc ?? product.description?.slice(0, 160);
  const imageUrl = (product.images as { url: string }[] | null)?.[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("products")
    .select(
      `*, images:product_images(*), category:categories(id,name,slug), reviews:product_reviews(*, user:users(name))`
    )
    .eq("slug", slug)
    .eq("isActive", true)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select(`*, images:product_images(*), category:categories(id,name,slug)`)
    .eq("categoryId", product.categoryId)
    .eq("isActive", true)
    .neq("id", product.id)
    .limit(4);

  return <ProductDetailClient product={product as never} related={(related ?? []) as never} />;
}
