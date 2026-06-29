"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Rings",
    slug: "rings",
    icon: "💍",
    accent: "var(--emerald)",
    count: "124 designs",
    description: "From solitaire to stacked",
  },
  {
    label: "Necklaces",
    slug: "necklaces",
    icon: "📿",
    accent: "var(--gold)",
    count: "86 designs",
    description: "Layered elegance, enduring beauty",
  },
  {
    label: "Earrings",
    slug: "earrings",
    icon: "✨",
    accent: "var(--emerald-light)",
    count: "98 designs",
    description: "Studs, drops & chandeliers",
  },
  {
    label: "Bracelets",
    slug: "bracelets",
    icon: "🔗",
    accent: "var(--gold-deep)",
    count: "62 designs",
    description: "Tennis, bangles & charm",
  },
  {
    label: "Pendants",
    slug: "pendants",
    icon: "🌟",
    accent: "var(--emerald-mid)",
    count: "44 designs",
    description: "Personal talismans",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="section-eyebrow mb-3">Explore</p>
        <h2 className="section-title">Fine Jewelry Collections</h2>
        <div className="divider-gold mt-5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={`/catalog?category=${cat.slug}`}
              className="group block rounded-sm overflow-hidden relative"
              style={{
                background: "var(--white)",
                border: "1px solid var(--pearl-dark)",
              }}
            >
              <div className="p-6 pb-8">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ background: "var(--emerald-fog)" }}
                >
                  {cat.icon}
                </div>

                <h3
                  className="font-serif text-lg font-medium mb-1"
                  style={{ color: "var(--emerald-deep)" }}
                >
                  {cat.label}
                </h3>
                <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
                  {cat.description}
                </p>
                <span className="text-xs font-semibold" style={{ color: cat.accent }}>
                  {cat.count}
                </span>
              </div>

              {/* Hover reveal arrow */}
              <div
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                style={{ background: "var(--emerald)", color: "var(--pearl)" }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 transition-transform origin-left scale-x-0 group-hover:scale-x-100"
                style={{ background: cat.accent }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
