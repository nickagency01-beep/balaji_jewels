import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DesignerCTA from "@/components/home/DesignerCTA";
import Testimonials from "@/components/home/Testimonials";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "LUMORA — Fine Jewelry Handcrafted in Gold & Precious Stones",
};

async function getFeaturedProducts() {
  try {
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*), category:categories(id,name,slug)")
      .eq("isFeatured", true)
      .eq("isActive", true)
      .order("createdAt", { ascending: false })
      .limit(8);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts products={featured as never} />
      <BrandStory />
      <DesignerCTA />
      <Testimonials />
    </>
  );
}
