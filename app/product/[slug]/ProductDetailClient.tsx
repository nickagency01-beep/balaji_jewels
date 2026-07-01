"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Shield, RefreshCw, Package, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, METAL_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  user: { name: string };
}

interface Props {
  product: Product & { reviews: Review[] };
  related: Product[];
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "var(--pearl-dark)" }}>
      <button
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-left"
        style={{ color: "var(--ink)" }}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <ChevronDown
          className="w-4 h-4 transition-transform flex-shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--gold)",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailClient({ product, related }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] ?? "");
  const [engraving, setEngraving] = useState("");
  const [engravingOpen, setEngravingOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wishlisted = has(product.id);

  const primaryImg = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  function handleAddToCart() {
    if (product.sizeable && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: primaryImg?.url ?? "",
        stock: product.stock,
        size: selectedSize || undefined,
        engraving: engraving || undefined,
      });
    }
    toast.success("Added to your bag");
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/catalog" className="hover:text-emerald transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          {product.category && (
            <>
              <Link
                href={`/catalog?category=${product.category.slug}`}
                className="hover:text-emerald transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span style={{ color: "var(--ink-light)" }}>{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative aspect-square rounded-sm overflow-hidden"
              style={{ background: "var(--pearl-mid)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {product.images[activeImg] ? (
                    <Image
                      src={product.images[activeImg].url}
                      alt={product.images[activeImg].altText ?? product.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">💍</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {product.badge && (
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase"
                  style={{ background: "var(--emerald)", color: "var(--pearl)" }}
                >
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: i === activeImg ? "var(--emerald)" : "var(--pearl-dark)",
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.name} ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category & collection */}
            <div className="flex items-center gap-3 mb-2">
              {product.category && (
                <Link
                  href={`/catalog?category=${product.category.slug}`}
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "var(--gold)" }}
                >
                  {product.category.name}
                </Link>
              )}
              {product.collection && (
                <>
                  <span style={{ color: "var(--pearl-dark)" }}>·</span>
                  <span className="text-xs" style={{ color: "var(--slate)" }}>
                    {product.collection} Collection
                  </span>
                </>
              )}
            </div>

            <h1
              className="font-serif font-medium leading-tight mb-4"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--emerald-deep)",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < Math.round(avgRating) ? "fill-current" : "fill-none"
                      )}
                      style={{ color: "var(--gold)" }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--slate)" }}>
                  {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="font-serif text-2xl font-medium"
                style={{ color: "var(--emerald-deep)" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-base line-through" style={{ color: "var(--slate-light)" }}>
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <div className="divider-gold-left mb-6" />

            {/* Metal & gemstone */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                className="p-3 rounded-sm text-sm"
                style={{ background: "var(--emerald-fog)" }}
              >
                <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--emerald)" }}>Metal</p>
                <p style={{ color: "var(--ink-light)" }}>{METAL_LABELS[product.metalType]}</p>
              </div>
              {product.gemstone && (
                <div
                  className="p-3 rounded-sm text-sm"
                  style={{ background: "var(--gold-whisper)" }}
                >
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--gold-deep)" }}>
                    Gemstone
                  </p>
                  <p style={{ color: "var(--ink-light)" }}>
                    {product.gemstone}
                    {product.gemstoneCarats && ` · ${product.gemstoneCarats}ct`}
                  </p>
                </div>
              )}
            </div>

            {/* Size selector */}
            {product.sizeable && product.availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    Ring Size
                  </span>
                  <Link
                    href="/sizing-guide"
                    className="text-xs underline underline-offset-2"
                    style={{ color: "var(--gold-deep)" }}
                  >
                    Size guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-10 h-10 rounded-sm text-sm font-medium border transition-all"
                      style={{
                        borderColor:
                          selectedSize === size ? "var(--emerald)" : "var(--pearl-dark)",
                        background: selectedSize === size ? "var(--emerald)" : "var(--white)",
                        color: selectedSize === size ? "var(--pearl)" : "var(--ink)",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Engraving */}
            {product.engravable && (
              <div className="mb-6">
                <button
                  onClick={() => setEngravingOpen((o) => !o)}
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: "var(--emerald)" }}
                >
                  <span className="text-gold">✦</span>
                  {engravingOpen ? "Remove engraving" : "Add personal engraving"}
                </button>
                {engravingOpen && (
                  <div className="mt-3">
                    <input
                      type="text"
                      maxLength={20}
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value)}
                      placeholder="Up to 20 characters"
                      className="input-base"
                    />
                    <p className="text-xs mt-1" style={{ color: "var(--slate-light)" }}>
                      {engraving.length}/20 characters
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="flex items-center border rounded-sm"
                style={{ borderColor: "var(--pearl-dark)" }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-sm transition-colors hover:text-emerald"
                  style={{ color: "var(--slate)" }}
                >
                  −
                </button>
                <span className="px-4 py-2.5 text-sm font-medium w-12 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-sm transition-colors hover:text-emerald"
                  style={{ color: "var(--slate)" }}
                >
                  +
                </button>
              </div>
              <span className="text-xs" style={{ color: product.stock < 5 ? "var(--gold-deep)" : "var(--slate)" }}>
                {product.stock === 0
                  ? "Out of stock"
                  : product.stock < 5
                  ? `Only ${product.stock} left`
                  : "In stock"}
              </span>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? "Sold Out" : "Add to Bag"}
              </button>
              <button
                onClick={() => toggle(product.id)}
                className="w-12 h-12 flex items-center justify-center border rounded-sm transition-all"
                style={{
                  borderColor: wishlisted ? "var(--gold)" : "var(--pearl-dark)",
                  color: wishlisted ? "var(--gold)" : "var(--slate)",
                }}
                aria-label="Wishlist"
              >
                <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
              </button>
            </div>

            {/* Trust badges */}
            <div
              className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t"
              style={{ borderColor: "var(--pearl-dark)" }}
            >
              {[
                { icon: Shield, label: "Certified", sub: "GIA / IGI" },
                { icon: RefreshCw, label: "30-Day", sub: "Returns" },
                { icon: Package, label: "Free Ship", sub: "on ₹5,000+" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: "var(--emerald-light)" }} />
                  <p className="text-xs font-semibold" style={{ color: "var(--ink-light)" }}>{label}</p>
                  <p className="text-[10px]" style={{ color: "var(--slate)" }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="mt-8 space-y-0">
              <AccordionItem title="Product Details">
                <p>{product.description}</p>
                {product.caratWeight && (
                  <p className="mt-2">
                    <strong>Carat Weight:</strong> {product.caratWeight}ct
                  </p>
                )}
                {product.dimensions && (
                  <p>
                    <strong>Dimensions:</strong> {product.dimensions}
                  </p>
                )}
                {product.weight && (
                  <p>
                    <strong>Weight:</strong> {product.weight}g
                  </p>
                )}
                {product.certification && (
                  <p>
                    <strong>Certificate:</strong> {product.certification}
                  </p>
                )}
              </AccordionItem>

              {product.story && (
                <AccordionItem title="The Story Behind This Piece">
                  <p>{product.story}</p>
                </AccordionItem>
              )}

              <AccordionItem title="Shipping & Returns">
                <p>Free standard shipping on orders above ₹5,000. Express delivery available.</p>
                <p className="mt-2">30-day returns accepted for unworn items in original condition. Custom and engraved pieces are non-returnable.</p>
              </AccordionItem>

              <AccordionItem title="Care Instructions">
                <p>Store in the provided pouch or box when not wearing. Avoid contact with perfumes, lotions, and chlorine. Clean gently with a soft cloth.</p>
                <p className="mt-2">Complimentary cleaning and inspection at any BALAJI boutique.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <section className="mt-20 pt-12 border-t" style={{ borderColor: "var(--pearl-dark)" }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--emerald-deep)" }}>
                Customer Reviews ({product.reviews.length})
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("w-4 h-4", i < Math.round(avgRating) ? "fill-current" : "")}
                      style={{ color: "var(--gold)" }}
                    />
                  ))}
                </div>
                <span className="font-semibold" style={{ color: "var(--emerald-deep)" }}>
                  {avgRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-sm"
                  style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-3.5 h-3.5", i < review.rating ? "fill-current" : "")}
                        style={{ color: "var(--gold)" }}
                      />
                    ))}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-sm mb-2" style={{ color: "var(--ink)" }}>
                      {review.title}
                    </h4>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
                    {review.body}
                  </p>
                  <p className="text-xs mt-3 font-medium" style={{ color: "var(--emerald-light)" }}>
                    {review.user.name} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t" style={{ borderColor: "var(--pearl-dark)" }}>
            <h2
              className="font-serif text-2xl font-medium mb-8"
              style={{ color: "var(--emerald-deep)" }}
            >
              You May Also Love
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
