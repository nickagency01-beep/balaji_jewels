"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/types";

const METAL_OPTIONS = [
  { value: "YELLOW_GOLD_18K", label: "18K Yellow Gold" },
  { value: "YELLOW_GOLD_14K", label: "14K Yellow Gold" },
  { value: "WHITE_GOLD_18K", label: "18K White Gold" },
  { value: "ROSE_GOLD_18K", label: "18K Rose Gold" },
  { value: "PLATINUM", label: "Platinum" },
  { value: "SILVER_925", label: "Sterling Silver" },
];

const GEMSTONE_OPTIONS = [
  "Diamond", "Emerald", "Ruby", "Sapphire", "Pearl",
  "Amethyst", "Topaz", "Opal", "Metal Only",
];

const COLLECTION_OPTIONS = [
  "Eternal", "Celestial", "Verdant", "Aurora", "Heritage",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  productCount: number;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b py-4" style={{ borderColor: "var(--pearl-dark)" }}>
      <button
        className="w-full flex items-center justify-between mb-3 text-sm font-semibold tracking-wide uppercase"
        style={{ color: "var(--ink-light)" }}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={cn(
          "w-4 h-4 border flex-shrink-0 flex items-center justify-center rounded-sm transition-all",
          checked
            ? "border-emerald bg-emerald"
            : "border-stone group-hover:border-emerald"
        )}
        style={{
          background: checked ? "var(--emerald)" : "transparent",
          borderColor: checked ? "var(--emerald)" : "var(--stone)",
        }}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm" style={{ color: "var(--ink-light)" }}>{label}</span>
    </label>
  );
}

export default function ProductFilter({ filters, onFilterChange, productCount }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = [
    filters.metalType?.length,
    filters.gemstone?.length,
    filters.collection,
    filters.priceMin || filters.priceMax,
  ].filter(Boolean).length;

  const clearAll = () =>
    onFilterChange({ sort: filters.sort, search: filters.search });

  const toggleMetal = (v: string) => {
    const arr = filters.metalType ?? [];
    onFilterChange({
      ...filters,
      metalType: arr.includes(v as never)
        ? arr.filter((m) => m !== v)
        : [...arr, v as never],
    });
  };

  const toggleGemstone = (v: string) => {
    const arr = filters.gemstone ?? [];
    onFilterChange({
      ...filters,
      gemstone: arr.includes(v) ? arr.filter((g) => g !== v) : [...arr, v],
    });
  };

  const filterContent = (
    <div className="space-y-0">
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--pearl-dark)" }}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: "var(--emerald)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: "var(--emerald)", color: "var(--pearl)" }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs underline underline-offset-2"
            style={{ color: "var(--slate)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By">
        {SORT_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="sort"
              value={opt.value}
              checked={filters.sort === opt.value}
              onChange={() => onFilterChange({ ...filters, sort: opt.value as FilterState["sort"] })}
              className="sr-only"
            />
            <div
              className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center"
              style={{
                borderColor: filters.sort === opt.value ? "var(--emerald)" : "var(--stone)",
                background: filters.sort === opt.value ? "var(--emerald)" : "transparent",
              }}
            >
              {filters.sort === opt.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm" style={{ color: "var(--ink-light)" }}>{opt.label}</span>
          </label>
        ))}
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) || undefined })}
            className="input-base text-xs py-2 px-3 w-full"
          />
          <span style={{ color: "var(--slate)" }}>—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) || undefined })}
            className="input-base text-xs py-2 px-3 w-full"
          />
        </div>
      </Section>

      {/* Metal */}
      <Section title="Metal Type">
        {METAL_OPTIONS.map((opt) => (
          <CheckItem
            key={opt.value}
            label={opt.label}
            checked={(filters.metalType ?? []).includes(opt.value as never)}
            onChange={() => toggleMetal(opt.value)}
          />
        ))}
      </Section>

      {/* Gemstone */}
      <Section title="Gemstone">
        {GEMSTONE_OPTIONS.map((gem) => (
          <CheckItem
            key={gem}
            label={gem}
            checked={(filters.gemstone ?? []).includes(gem)}
            onChange={() => toggleGemstone(gem)}
          />
        ))}
      </Section>

      {/* Collection */}
      <Section title="Collection">
        {COLLECTION_OPTIONS.map((col) => (
          <CheckItem
            key={col}
            label={col}
            checked={filters.collection === col}
            onChange={() =>
              onFilterChange({
                ...filters,
                collection: filters.collection === col ? undefined : col,
              })
            }
          />
        ))}
      </Section>

      <p className="pt-4 text-xs" style={{ color: "var(--slate-light)" }}>
        {productCount} result{productCount !== 1 ? "s" : ""}
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start">
        {filterContent}
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-sm text-sm font-medium"
          style={{ borderColor: "var(--pearl-dark)", color: "var(--ink)" }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="flex-1"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="w-80 h-full overflow-y-auto p-6 shadow-2xl"
              style={{ background: "var(--pearl)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold" style={{ color: "var(--ink)" }}>Filters</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" style={{ color: "var(--slate)" }} />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
