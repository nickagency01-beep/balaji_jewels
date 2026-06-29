"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, METAL_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovering, setHovering] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wishlisted = has(product.id);

  const primaryImg = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImg = product.images[1];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: primaryImg?.url ?? "",
      stock: product.stock,
    });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  }

  return (
    <motion.article
      className="product-card bg-white rounded-sm overflow-hidden group"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => { setHovering(false); setImgIdx(0); }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div
          className="relative img-zoom"
          style={{ background: "var(--pearl-mid)", aspectRatio: "3/4" }}
          onMouseEnter={() => secondaryImg && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          {primaryImg && (
            <Image
              src={imgIdx === 1 && secondaryImg ? secondaryImg.url : primaryImg.url}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
              priority={priority}
            />
          )}

          {/* Badge */}
          {product.badge && (
            <div
              className="absolute top-3 left-3 badge-gold"
              style={{ background: "var(--emerald)", color: "var(--pearl)" }}
            >
              {product.badge}
            </div>
          )}

          {/* Compare price */}
          {product.comparePrice && (
            <div
              className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-sm"
              style={{ background: "var(--gold)", color: "var(--ink)" }}
            >
              SALE
            </div>
          )}

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={hovering ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 flex gap-2 p-3"
          >
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-sm"
              style={{
                background: product.stock === 0 ? "var(--stone)" : "var(--emerald)",
                color: "var(--pearl)",
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock === 0 ? "Sold Out" : "Add to Bag"}
            </button>
            <Link
              href={`/product/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 flex items-center justify-center rounded-sm transition-colors"
              style={{ background: "rgba(255,255,255,0.9)", color: "var(--emerald)" }}
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              wishlisted ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100"
            )}
            style={{
              background: "rgba(255,255,255,0.9)",
              color: wishlisted ? "var(--gold)" : "var(--slate)",
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-3.5 h-3.5", wishlisted && "fill-current")} />
          </button>

          {/* Image dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.slice(0, 4).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === imgIdx ? "var(--pearl)" : "rgba(255,255,255,0.45)" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs mb-1" style={{ color: "var(--gold-deep)" }}>
            {METAL_LABELS[product.metalType]}
            {product.gemstone && ` · ${product.gemstone}`}
          </p>
          <h3
            className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-emerald transition-colors"
            style={{ color: "var(--ink-mid)" }}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-semibold text-sm" style={{ color: "var(--emerald-deep)" }}>
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span
                className="text-xs line-through"
                style={{ color: "var(--slate-light)" }}
              >
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
