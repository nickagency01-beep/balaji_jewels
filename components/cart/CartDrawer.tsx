"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(10,10,10,0.55)" }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col shadow-2xl"
            style={{ background: "var(--pearl)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--pearl-dark)" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" style={{ color: "var(--emerald)" }} />
                <h2
                  className="font-serif text-lg font-medium"
                  style={{ color: "var(--emerald-deep)" }}
                >
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "var(--gold-whisper)", color: "var(--gold-deep)" }}
                  >
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded transition-colors hover:bg-pearl-mid"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" style={{ color: "var(--slate)" }} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "var(--emerald-fog)" }}
                  >
                    <ShoppingBag className="w-9 h-9" style={{ color: "var(--emerald-light)" }} />
                  </div>
                  <div>
                    <p
                      className="font-serif text-lg font-medium"
                      style={{ color: "var(--emerald-deep)" }}
                    >
                      Your cart is empty
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
                      Discover our fine jewelry collections
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="btn-primary mt-2"
                  >
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y" style={{ borderColor: "var(--pearl-mid)" }}>
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.size}`} className="flex gap-4 px-6 py-5">
                      <Link href={`/product/${item.slug}`} onClick={closeCart} className="flex-shrink-0">
                        <div
                          className="w-20 h-24 rounded-sm overflow-hidden"
                          style={{ background: "var(--pearl-mid)" }}
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.slug}`} onClick={closeCart}>
                          <h3
                            className="text-sm font-medium leading-tight line-clamp-2 hover:text-emerald transition-colors"
                            style={{ color: "var(--ink)" }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        {item.size && (
                          <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                            Size {item.size}
                          </p>
                        )}
                        {item.engraving && (
                          <p className="text-xs mt-0.5 italic" style={{ color: "var(--slate)" }}>
                            &ldquo;{item.engraving}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div
                            className="flex items-center gap-2 border rounded-sm"
                            style={{ borderColor: "var(--pearl-dark)" }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1, item.size)
                              }
                              className="p-1.5 transition-colors hover:text-emerald"
                              style={{ color: "var(--slate)" }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm w-6 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1, item.size)
                              }
                              className="p-1.5 transition-colors hover:text-emerald"
                              style={{ color: "var(--slate)" }}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className="text-sm font-semibold"
                              style={{ color: "var(--emerald-deep)" }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId, item.size)}
                              className="p-1 transition-colors"
                              style={{ color: "var(--slate-light)" }}
                              aria-label="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="border-t px-6 py-6 space-y-4"
                style={{ borderColor: "var(--pearl-dark)", background: "var(--white)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: "var(--slate)" }}>
                    Subtotal
                  </span>
                  <span
                    className="font-semibold text-lg"
                    style={{ color: "var(--emerald-deep)" }}
                  >
                    {formatPrice(subtotal())}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--slate-light)" }}>
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm underline underline-offset-2 transition-colors"
                  style={{ color: "var(--slate)" }}
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
