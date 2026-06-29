"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import type { MetalType } from "@/types";

const METALS: { value: MetalType; label: string; color: string; desc: string }[] = [
  { value: "YELLOW_GOLD_18K", label: "18K Yellow Gold", color: "#c9a84c", desc: "Classic warm gold" },
  { value: "WHITE_GOLD_18K", label: "18K White Gold", color: "#e8e8e8", desc: "Sleek modern finish" },
  { value: "ROSE_GOLD_18K", label: "18K Rose Gold", color: "#e8a87c", desc: "Romantic warm blush" },
  { value: "PLATINUM", label: "Platinum", color: "#d0d0e8", desc: "Premium & hypoallergenic" },
];

const GEMSTONES = [
  { id: "diamond", label: "Diamond", icon: "💎", color: "#e8f4f8", price: 800 },
  { id: "emerald", label: "Emerald", icon: "🟢", color: "#dcfce7", price: 600 },
  { id: "ruby", label: "Ruby", icon: "🔴", color: "#fee2e2", price: 550 },
  { id: "sapphire", label: "Sapphire", icon: "🔵", color: "#dbeafe", price: 500 },
  { id: "pearl", label: "Pearl", icon: "⚪", color: "#f5f5f5", price: 200 },
  { id: "amethyst", label: "Amethyst", icon: "🟣", color: "#ede9fe", price: 150 },
  { id: "none", label: "Metal Only", icon: "✦", color: "var(--pearl-mid)", price: 0 },
];

const SETTINGS = [
  { id: "solitaire", label: "Solitaire", desc: "Single stone, timeless" },
  { id: "halo", label: "Halo", desc: "Center stone with ring of smaller gems" },
  { id: "pavé", label: "Pavé", desc: "Small stones set closely together" },
  { id: "bezel", label: "Bezel", desc: "Stone enclosed in metal rim" },
  { id: "cluster", label: "Cluster", desc: "Multiple stones arranged together" },
];

const CATEGORIES = ["Ring", "Necklace", "Pendant", "Earrings", "Bracelet"];

const BASE_PRICES: Record<string, number> = {
  Ring: 800,
  Necklace: 1200,
  Pendant: 600,
  Earrings: 900,
  Bracelet: 1100,
};

const METAL_PREMIUM: Record<string, number> = {
  YELLOW_GOLD_18K: 0,
  WHITE_GOLD_18K: 100,
  ROSE_GOLD_18K: 80,
  PLATINUM: 400,
};

export default function DesignerPage() {
  const [category, setCategory] = useState("Ring");
  const [metal, setMetal] = useState<MetalType>("YELLOW_GOLD_18K");
  const [gemstone, setGemstone] = useState("diamond");
  const [setting, setSetting] = useState("solitaire");
  const [engraving, setEngraving] = useState("");
  const [step, setStep] = useState(0);

  const addItem = useCartStore((s) => s.addItem);

  const gem = GEMSTONES.find((g) => g.id === gemstone)!;
  const totalPrice =
    (BASE_PRICES[category] ?? 800) +
    (METAL_PREMIUM[metal] ?? 0) +
    (gem?.price ?? 0);

  const STEPS = [
    { label: "Piece Type", done: true },
    { label: "Metal", done: step >= 1 },
    { label: "Gemstone", done: step >= 2 },
    { label: "Setting", done: step >= 3 },
    { label: "Engrave", done: step >= 4 },
  ];

  function handleAddToCart() {
    const metalLabel = METALS.find((m) => m.value === metal)?.label ?? metal;
    addItem({
      productId: `custom-${Date.now()}`,
      name: `Custom ${category} — ${metalLabel} + ${gem.label}`,
      slug: "designer",
      price: totalPrice,
      imageUrl: "",
      stock: 1,
      engraving: engraving || undefined,
    });
    toast.success("Custom design added to bag!");
  }

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Design Studio</p>
          <h1 className="section-title mb-4">Design Your Own Jewelry</h1>
          <div className="divider-gold mb-4" />
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--slate)" }}>
            Configure your dream piece step by step. Our master artisans will craft it exclusively for you.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <button
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 transition-all"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: step === i ? "var(--emerald)" : s.done ? "var(--emerald-mist)" : "var(--pearl-dark)",
                    color: step === i ? "var(--pearl)" : s.done ? "var(--emerald)" : "var(--slate)",
                    border: step === i ? "none" : "1px solid transparent",
                  }}
                >
                  {s.done && step !== i ? "✓" : i + 1}
                </div>
                <span className="text-[10px] font-medium" style={{ color: step === i ? "var(--emerald)" : "var(--slate)" }}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="w-12 h-px mt-[-12px] mx-1"
                  style={{ background: s.done ? "var(--emerald-mist)" : "var(--pearl-dark)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configurator */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Category */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-sm p-6"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    What would you like to design?
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); }}
                        className="p-4 rounded-sm text-center text-sm font-medium transition-all"
                        style={{
                          border: `1px solid ${category === cat ? "var(--emerald)" : "var(--pearl-dark)"}`,
                          background: category === cat ? "var(--emerald-fog)" : "var(--pearl)",
                          color: category === cat ? "var(--emerald)" : "var(--ink)",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="btn-primary mt-6">
                    Next: Choose Metal →
                  </button>
                </motion.div>
              )}

              {/* Step 1: Metal */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-sm p-6"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Choose your metal
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {METALS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMetal(m.value)}
                        className="flex items-center gap-4 p-4 rounded-sm text-left transition-all"
                        style={{
                          border: `1px solid ${metal === m.value ? "var(--emerald)" : "var(--pearl-dark)"}`,
                          background: metal === m.value ? "var(--emerald-fog)" : "var(--pearl)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          style={{ background: m.color, border: "2px solid rgba(0,0,0,0.08)" }}
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>{m.label}</p>
                          <p className="text-xs" style={{ color: "var(--slate)" }}>{m.desc}</p>
                          {METAL_PREMIUM[m.value] > 0 && (
                            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--gold-deep)" }}>
                              +${METAL_PREMIUM[m.value]}
                            </p>
                          )}
                        </div>
                        {metal === m.value && (
                          <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--emerald)" }}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="btn-outline-gold">← Back</button>
                    <button onClick={() => setStep(2)} className="btn-primary">Next: Gemstone →</button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Gemstone */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-sm p-6"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Choose your gemstone
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GEMSTONES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGemstone(g.id)}
                        className="p-4 rounded-sm text-center transition-all"
                        style={{
                          border: `1px solid ${gemstone === g.id ? "var(--emerald)" : "var(--pearl-dark)"}`,
                          background: gemstone === g.id ? g.color : "var(--pearl)",
                        }}
                      >
                        <div className="text-2xl mb-2">{g.icon}</div>
                        <p className="text-xs font-medium" style={{ color: "var(--ink)" }}>{g.label}</p>
                        {g.price > 0 && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--gold-deep)" }}>+${g.price}</p>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="btn-outline-gold">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary">Next: Setting →</button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Setting */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-sm p-6"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Choose the setting style
                  </h2>
                  <div className="space-y-3">
                    {SETTINGS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSetting(s.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-sm text-left transition-all"
                        style={{
                          border: `1px solid ${setting === s.id ? "var(--emerald)" : "var(--pearl-dark)"}`,
                          background: setting === s.id ? "var(--emerald-fog)" : "var(--pearl)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-serif"
                          style={{ background: setting === s.id ? "var(--emerald)" : "var(--pearl-dark)", color: setting === s.id ? "var(--pearl)" : "var(--slate)" }}
                        >
                          ◎
                        </div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>{s.label}</p>
                          <p className="text-xs" style={{ color: "var(--slate)" }}>{s.desc}</p>
                        </div>
                        {setting === s.id && (
                          <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--emerald)" }}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(2)} className="btn-outline-gold">← Back</button>
                    <button onClick={() => setStep(4)} className="btn-primary">Next: Engraving →</button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Engraving */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-sm p-6"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <h2 className="font-serif text-lg font-medium mb-5" style={{ color: "var(--emerald-deep)" }}>
                    Add a personal touch (optional)
                  </h2>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-light)" }}>
                      Engraving Text
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value)}
                      placeholder="e.g. 'Forever & Always', a date, initials…"
                      className="input-base"
                    />
                    <p className="text-xs mt-1.5" style={{ color: "var(--slate-light)" }}>
                      {engraving.length}/20 characters · Leave blank to skip
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(3)} className="btn-outline-gold">← Back</button>
                    <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Preview */}
          <div>
            <div
              className="rounded-sm p-6 sticky top-24"
              style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: "var(--gold)" }} />
                <h3 className="font-semibold text-sm" style={{ color: "var(--ink)" }}>Live Preview</h3>
              </div>

              {/* Visual mock */}
              <div
                className="aspect-square rounded-sm flex items-center justify-center mb-5"
                style={{ background: "var(--emerald-fog)" }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {category === "Ring" ? "💍" :
                     category === "Necklace" ? "📿" :
                     category === "Earrings" ? "✨" :
                     category === "Bracelet" ? "🔗" : "⭐"}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full mx-auto"
                    style={{ background: METALS.find((m) => m.value === metal)?.color ?? "#c9a84c" }}
                  />
                  <p className="text-xs mt-2 font-medium" style={{ color: "var(--emerald)" }}>
                    {GEMSTONES.find((g) => g.id === gemstone)?.icon ?? "💎"}{" "}
                    {gem?.label}
                  </p>
                </div>
              </div>

              {/* Config summary */}
              <div className="space-y-2 text-xs border-t pt-4" style={{ borderColor: "var(--pearl-dark)" }}>
                {[
                  ["Piece", category],
                  ["Metal", METALS.find((m) => m.value === metal)?.label ?? metal],
                  ["Gemstone", gem?.label],
                  ["Setting", setting.charAt(0).toUpperCase() + setting.slice(1)],
                  engraving ? ["Engraving", `"${engraving}"`] : null,
                ].filter(Boolean).map((row) => row && (
                  <div key={row[0]} className="flex justify-between">
                    <span style={{ color: "var(--slate)" }}>{row[0]}</span>
                    <span className="font-medium" style={{ color: "var(--ink)" }}>{row[1]}</span>
                  </div>
                ))}
                <div
                  className="pt-2 border-t flex justify-between font-semibold text-sm"
                  style={{ borderColor: "var(--pearl-dark)", color: "var(--emerald-deep)" }}
                >
                  <span>Est. Price</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[10px] mt-3" style={{ color: "var(--slate-light)" }}>
                Final price confirmed after artisan review. Delivery in 3–4 weeks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
