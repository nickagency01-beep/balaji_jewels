"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PILLARS = [
  {
    icon: "⬡",
    title: "Ethical Sourcing",
    body: "Every gemstone we use is conflict-free, traceable to its origin, and certified by leading gemological institutes.",
  },
  {
    icon: "✦",
    title: "Master Artisans",
    body: "Our jewelry is handcrafted by third-generation goldsmiths who have honed their skills over decades of devoted practice.",
  },
  {
    icon: "◎",
    title: "Lifetime Warranty",
    body: "We stand behind every piece we create. Free cleaning, polishing, and prong retipping for the life of your jewelry.",
  },
];

export default function BrandStory() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "var(--emerald-deep)" }}
    >
      {/* Decorative line art */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1440 600">
          <circle cx="200" cy="300" r="250" fill="none" stroke="#c9a84c" strokeWidth="1" />
          <circle cx="1240" cy="300" r="350" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="1440" y2="600" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-eyebrow mb-4" style={{ color: "var(--gold)" }}>
              Our Story
            </p>
            <h2
              className="font-serif font-medium leading-tight mb-6"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--pearl)",
              }}
            >
              Born in Light,
              <br />
              Crafted in Gold
            </h2>
            <div className="divider-gold-left mb-6" />
            <p className="leading-relaxed mb-4" style={{ color: "var(--emerald-mist)" }}>
              LUMORA was founded on a single belief: that fine jewelry should feel as meaningful as it looks.
              We work with generational artisans in Jaipur, Mumbai, and Antwerp, fusing ancient goldsmithing
              traditions with contemporary design sensibility.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "var(--emerald-mist)" }}>
              Each piece begins as a sketch, becomes a wax model, and is hand-finished by craftspeople
              who pour decades of knowledge into every setting, every prong, every polish.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
              style={{ color: "var(--gold)" }}
            >
              Learn our craft <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Pillars */}
          <div className="space-y-6">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-5 p-6 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-serif font-medium"
                  style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: "var(--pearl)" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--emerald-mist)" }}>
                    {p.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
