"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import type { Product, FilterState } from "@/types";

interface Props {
  initialProducts: Product[];
  total: number;
  page: number;
  perPage: number;
  initialSearch?: string;
}

export default function CatalogClient({
  initialProducts,
  total,
  page,
  perPage,
  initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") ?? undefined,
    sort: (searchParams.get("sort") as FilterState["sort"]) ?? "featured",
    search: initialSearch,
  });

  const applyFilters = useCallback(
    (f: FilterState) => {
      setFilters(f);
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.category) params.set("category", f.category);
      if (f.sort) params.set("sort", f.sort);
      if (f.collection) params.set("collection", f.collection);
      if (f.metalType?.length) params.set("metal", f.metalType[0]);
      if (f.gemstone?.length) params.set("gemstone", f.gemstone[0]);
      if (f.priceMin) params.set("priceMin", String(f.priceMin));
      if (f.priceMax) params.set("priceMax", String(f.priceMax));
      startTransition(() => router.push(`/catalog?${params.toString()}`));
    },
    [router]
  );

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Collections</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="section-title">
            {filters.category
              ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
              : filters.search
              ? `Search: "${filters.search}"`
              : "All Jewelry"}
          </h1>
          {/* Search bar */}
          <div
            className="flex items-center gap-2 border rounded-sm px-3 py-2 max-w-xs"
            style={{ borderColor: "var(--pearl-dark)", background: "var(--white)" }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--slate)" }} />
            <input
              type="text"
              placeholder="Search..."
              defaultValue={filters.search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters({ ...filters, search: (e.target as HTMLInputElement).value });
                }
              }}
              className="text-sm outline-none w-full bg-transparent"
              style={{ color: "var(--ink)" }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters */}
        <ProductFilter
          filters={filters}
          onFilterChange={applyFilters}
          productCount={total}
        />

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters row */}
          <div className="lg:hidden mb-4">
            <ProductFilter
              filters={filters}
              onFilterChange={applyFilters}
              productCount={total}
            />
          </div>

          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-sm overflow-hidden">
                  <div className="skeleton" style={{ aspectRatio: "3/4" }} />
                  <div className="p-4 space-y-2 bg-white">
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : initialProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--emerald-fog)" }}
              >
                <Search className="w-8 h-8" style={{ color: "var(--emerald-light)" }} />
              </div>
              <h3
                className="font-serif text-xl font-medium mb-2"
                style={{ color: "var(--emerald-deep)" }}
              >
                No pieces found
              </h3>
              <p className="text-sm" style={{ color: "var(--slate)" }}>
                Try adjusting your filters or exploring a different category.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {initialProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 6} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("page", String(i + 1));
                        startTransition(() => router.push(`/catalog?${params.toString()}`));
                      }}
                      className="w-9 h-9 rounded-sm text-sm font-medium transition-all"
                      style={{
                        background: page === i + 1 ? "var(--emerald)" : "var(--white)",
                        color: page === i + 1 ? "var(--pearl)" : "var(--ink)",
                        border: "1px solid var(--pearl-dark)",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
