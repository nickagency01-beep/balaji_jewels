"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--emerald-deep)" }}
    >
      {/* Geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large faint circle */}
        <div
          className="absolute -right-1/4 -top-1/4 w-[80vw] h-[80vw] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--emerald-light), transparent 70%)" }}
        />
        {/* Gold accent lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="300" x2="1440" y2="200" stroke="#c9a84c" strokeWidth="1" />
          <line x1="0" y1="600" x2="1440" y2="700" stroke="#c9a84c" strokeWidth="0.5" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="#c9a84c" strokeWidth="0.5" />
          <circle cx="720" cy="450" r="300" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
        {/* Floating gem shape */}
        <motion.div
          className="absolute right-[8%] top-[20%] w-64 h-64 opacity-20"
          animate={{ rotate: [0, 8, 0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,10 190,80 160,190 40,190 10,80" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
            <polygon points="100,40 165,90 142,165 58,165 35,90" fill="rgba(201,168,76,0.05)" stroke="#c9a84c" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 grid lg:grid-cols-2 items-center gap-16">
        {/* Text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-eyebrow mb-6"
            style={{ color: "var(--gold)" }}
          >
            Introducing the Celestial Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif font-medium leading-[1.1]"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--pearl)",
            }}
          >
            Where Light
            <br />
            <span className="gold-shimmer">Becomes Gold</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="divider-gold-left my-8"
            style={{ width: 60 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base leading-relaxed max-w-md"
            style={{ color: "var(--emerald-mist)" }}
          >
            Each LUMORA piece is handcrafted by master artisans — a marriage of ancient technique and
            contemporary vision. Ethically sourced gemstones, certified gold, crafted to last a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link href="/catalog" className="btn-primary flex items-center gap-2">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/designer" className="btn-outline-gold">
              Design Your Own
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-10 mt-14"
          >
            {[
              { num: "15+", label: "Years of Craft" },
              { num: "12K+", label: "Happy Patrons" },
              { num: "500+", label: "Unique Designs" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-serif text-2xl font-medium" style={{ color: "var(--gold)" }}>
                  {num}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--emerald-mist)" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right panel — asymmetric product showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative h-[600px]">
            {/* Main image placeholder */}
            <div
              className="absolute right-0 top-0 w-80 h-96 rounded-sm overflow-hidden"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)" }}>
                    <span className="text-2xl">💍</span>
                  </div>
                  <p className="text-xs font-medium tracking-widest" style={{ color: "var(--gold)" }}>
                    CELESTIAL RING
                  </p>
                </div>
              </div>
            </div>
            {/* Secondary card */}
            <motion.div
              className="absolute left-0 bottom-10 w-52 h-64 rounded-sm overflow-hidden shadow-2xl"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)" }}>
                    <span className="text-xl">📿</span>
                  </div>
                  <p className="text-xs tracking-widest" style={{ color: "var(--gold)" }}>
                    AURORA NECKLACE
                  </p>
                </div>
              </div>
            </motion.div>
            {/* Price tag */}
            <motion.div
              className="absolute right-4 bottom-20 glass-dark rounded-sm px-4 py-3"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <p className="text-xs" style={{ color: "var(--gold-light)" }}>Starting from</p>
              <p className="font-serif text-lg font-medium" style={{ color: "var(--gold)" }}>$1,299</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest" style={{ color: "var(--gold)" }}>SCROLL</span>
        <div
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
