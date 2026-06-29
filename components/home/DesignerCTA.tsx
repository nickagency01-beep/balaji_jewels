"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DesignerCTA() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--gold-whisper)" }}
    >
      {/* Geometric decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="absolute right-0 top-0 h-full" viewBox="0 0 400 600" preserveAspectRatio="xMaxYMid slice">
          <circle cx="400" cy="300" r="280" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
          <circle cx="400" cy="300" r="200" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="400" y2="600" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 text-sm font-semibold"
          style={{
            background: "var(--emerald)",
            color: "var(--pearl)",
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "var(--gold)" }} />
          Design Your Own Jewelry
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-title mb-6"
        >
          Your Vision,
          <br />
          Our Craftsmanship
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base leading-relaxed max-w-xl mx-auto mb-10"
          style={{ color: "var(--slate)" }}
        >
          Use our intuitive design tool to choose your metal, select your gemstone, and
          configure the setting. Our artisans bring it to life — a one-of-a-kind piece,
          exclusively yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/designer" className="btn-primary flex items-center justify-center gap-2">
            Start Designing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/catalog" className="btn-outline-gold flex items-center justify-center gap-2">
            Browse Ready-Made
          </Link>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3 justify-center mt-12"
        >
          {[
            "Choose your metal",
            "Pick your gemstone",
            "Select the setting",
            "Add engraving",
            "Preview in 3D",
          ].map((feat) => (
            <span
              key={feat}
              className="text-xs px-4 py-2 rounded-full border font-medium"
              style={{ borderColor: "var(--emerald)", color: "var(--emerald)" }}
            >
              ✦ {feat}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
