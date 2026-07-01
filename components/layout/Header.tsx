"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Collections",
    href: "/catalog",
    sub: [
      { label: "Rings", href: "/catalog?category=rings" },
      { label: "Necklaces", href: "/catalog?category=necklaces" },
      { label: "Earrings", href: "/catalog?category=earrings" },
      { label: "Bracelets", href: "/catalog?category=bracelets" },
      { label: "Pendants", href: "/catalog?category=pendants" },
    ],
  },
  { label: "New Arrivals", href: "/catalog?sort=newest" },
  { label: "Bestsellers", href: "/catalog?sort=featured" },
  { label: "Design Your Own", href: "/designer" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen && !searchOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-pearl-dark shadow-sm"
      )}
      style={{ borderColor: transparent ? "transparent" : "var(--pearl-dark)" }}
    >
      {/* Announcement bar */}
      <div
        className={cn(
          "text-center py-2 text-xs tracking-widest font-medium transition-all duration-300",
          transparent ? "text-gold-light opacity-90" : "text-gold-deep"
        )}
        style={{
          background: transparent ? "transparent" : "var(--gold-whisper)",
          color: transparent ? "var(--gold-light)" : "var(--gold-deep)",
        }}
      >
        ✦ Free shipping on orders over ₹5,000 ✦ Complimentary gift wrapping ✦
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 group"
          aria-label="BALAJI home"
        >
          <div className="flex flex-col items-center leading-none">
            <span
              className={cn(
                "font-serif font-medium tracking-[0.3em] text-xl transition-colors",
                transparent ? "text-white" : "text-emerald-deep"
              )}
              style={{ color: transparent ? "#fff" : "var(--emerald-deep)" }}
            >
              BALAJI
            </span>
            <span
              className={cn(
                "text-[0.45rem] tracking-[0.4em] font-medium mt-0.5 transition-colors",
                transparent ? "text-gold-light" : "text-gold"
              )}
              style={{ color: transparent ? "var(--gold-light)" : "var(--gold)" }}
            >
              FINE JEWELRY
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.sub && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "hover:text-emerald"
                )}
                style={{
                  color: transparent
                    ? pathname === item.href ? "#c9a84c" : "rgba(255,255,255,0.9)"
                    : pathname === item.href ? "var(--emerald)" : "var(--ink-mid)",
                }}
              >
                {item.label}
                {item.sub && <ChevronDown className="w-3 h-3 opacity-70" />}
              </Link>

              {item.sub && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white shadow-xl border border-pearl-dark rounded-sm py-2 scale-in">
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-emerald-fog hover:text-emerald transition-colors"
                      style={{ color: "var(--ink-light)" }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className={cn(
              "p-2.5 rounded transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-ink hover:text-emerald"
            )}
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            className={cn(
              "p-2.5 rounded transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-ink hover:text-emerald"
            )}
            aria-label="Wishlist"
          >
            <Heart className="w-[18px] h-[18px]" />
          </Link>

          {/* Account */}
          <Link
            href={user ? "/account" : "/auth/login"}
            className={cn(
              "p-2.5 rounded transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-ink hover:text-emerald"
            )}
            aria-label={user ? "My Account" : "Sign In"}
          >
            <User className="w-[18px] h-[18px]" />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className={cn(
              "relative p-2.5 rounded transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-ink hover:text-emerald"
            )}
            aria-label={`Cart (${totalItems} items)`}
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {totalItems > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: "var(--gold)", color: "var(--ink)" }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              "lg:hidden p-2.5 ml-1 rounded transition-colors",
              transparent ? "text-white/80 hover:text-white" : "text-ink"
            )}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div
          className="border-t border-pearl-dark"
          style={{ background: "var(--white)" }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--slate)" }} />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
                }
                if (e.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search jewelry, gemstones, collections…"
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "var(--ink)" }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs"
              style={{ color: "var(--slate)" }}
            >
              ESC
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-pearl-dark"
          style={{ background: "var(--white)" }}
        >
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-3 font-medium text-sm rounded"
                  style={{ color: "var(--ink)" }}
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <div className="ml-4 border-l-2 pl-4" style={{ borderColor: "var(--pearl-dark)" }}>
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-2 text-sm"
                        style={{ color: "var(--slate)" }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div
              className="pt-4 mt-4 border-t flex items-center gap-4"
              style={{ borderColor: "var(--pearl-dark)" }}
            >
              <Link
                href={user ? "/account" : "/auth/login"}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--emerald)" }}
              >
                <User className="w-4 h-4" />
                {user ? user.name : "Sign In"}
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--slate)" }}
              >
                <Heart className="w-4 h-4" /> Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
