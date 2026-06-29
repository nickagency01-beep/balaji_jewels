"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { ids, toggle } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return; }
    setLoading(true);
    fetch(`/api/products?ids=${ids.join(",")}&perPage=48`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="pt-28 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/account"
            className="p-2 rounded-sm hover:bg-white transition-colors"
            style={{ color: "var(--slate)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="section-eyebrow">My Account</p>
            <h1 className="font-serif text-2xl font-medium" style={{ color: "var(--emerald-deep)" }}>
              Wishlist{ids.length > 0 ? ` (${ids.length})` : ""}
            </h1>
          </div>
        </div>

        {ids.length === 0 ? (
          <div
            className="rounded-sm p-16 text-center"
            style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
          >
            <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--pearl-dark)" }} />
            <p className="font-serif text-lg mb-2" style={{ color: "var(--ink)" }}>Your wishlist is empty</p>
            <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>
              Tap the heart icon on any piece to save it for later.
            </p>
            <Link href="/catalog" className="btn-primary">Discover Jewelry</Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: ids.length }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-sm" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-center text-sm mt-8" style={{ color: "var(--slate)" }}>
                Some saved items may no longer be available.
              </p>
            )}
            <div className="mt-8 text-center">
              <button
                onClick={() => ids.forEach((id) => toggle(id))}
                className="text-sm underline underline-offset-4"
                style={{ color: "var(--slate)" }}
              >
                Clear wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
