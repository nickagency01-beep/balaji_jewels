"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The Celestial Ring I ordered for our anniversary was beyond anything I imagined. The emerald setting is breathtaking and the craftsmanship is flawless.",
    piece: "Celestial Emerald Ring",
  },
  {
    name: "Anika Mehta",
    location: "Delhi",
    rating: 5,
    text: "I used the Design Your Own tool and had a pendant made from my grandmother's description. LUMORA brought it to life perfectly. A cherished heirloom.",
    piece: "Custom Heritage Pendant",
  },
  {
    name: "Rohan Gupta",
    location: "Bangalore",
    rating: 5,
    text: "The diamond solitaire arrived beautifully packaged. The GIA certificate and the quality of the cut was exactly as described. Will buy again.",
    piece: "Eternal Solitaire Ring",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="section-eyebrow mb-3">What Our Patrons Say</p>
        <h2 className="section-title">Stories of Light</h2>
        <div className="divider-gold mt-5" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="rounded-sm p-8"
            style={{
              background: "var(--white)",
              border: "1px solid var(--pearl-dark)",
            }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star
                  key={j}
                  className="w-4 h-4 fill-current"
                  style={{ color: "var(--gold)" }}
                />
              ))}
            </div>

            {/* Quote */}
            <p
              className="text-sm leading-relaxed mb-6 italic"
              style={{ color: "var(--ink-light)" }}
            >
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Attribution */}
            <div
              className="pt-5 border-t"
              style={{ borderColor: "var(--pearl-dark)" }}
            >
              <p className="font-semibold text-sm" style={{ color: "var(--emerald-deep)" }}>
                {t.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
                {t.location} · {t.piece}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust badges */}
      <div
        className="mt-16 pt-10 border-t flex flex-wrap justify-center gap-8"
        style={{ borderColor: "var(--pearl-dark)" }}
      >
        {[
          { num: "4.9", label: "Average Rating", sub: "from 2,400+ reviews" },
          { num: "100%", label: "Certified Gold", sub: "BIS Hallmarked" },
          { num: "30-Day", label: "Return Policy", sub: "Hassle-free returns" },
          { num: "Free", label: "Lifetime Cleaning", sub: "At any LUMORA store" },
        ].map(({ num, label, sub }) => (
          <div key={label} className="text-center">
            <div
              className="font-serif text-2xl font-medium mb-0.5"
              style={{ color: "var(--emerald-deep)" }}
            >
              {num}
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--ink-light)" }}>{label}</div>
            <div className="text-xs" style={{ color: "var(--slate)" }}>{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
