"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

export default function FeaturedProducts({ products }: Props) {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-eyebrow mb-3">Curated For You</p>
          <h2 className="section-title">Featured Pieces</h2>
        </div>
        <Link
          href="/catalog?sort=featured"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 whitespace-nowrap"
          style={{ color: "var(--emerald)" }}
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {products.length === 0 ? (
        /* Skeleton placeholders when no products yet */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-sm overflow-hidden">
              <div className="skeleton" style={{ aspectRatio: "3/4" }} />
              <div className="p-4 space-y-2 bg-white">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-4 w-40 rounded" />
                <div className="skeleton h-4 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <ProductCard product={product} priority={i < 4} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
