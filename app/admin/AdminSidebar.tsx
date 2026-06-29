"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Tag, BarChart3, LogOut, Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col min-h-screen border-r sticky top-0 h-screen"
      style={{ background: "var(--emerald-deep)", borderColor: "rgba(201,168,76,0.15)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
        <Link href="/admin">
          <span className="font-serif font-medium tracking-[0.25em] text-sm" style={{ color: "var(--pearl)" }}>
            LUMORA
          </span>
          <div className="text-[0.5rem] tracking-[0.3em] font-medium mt-0.5" style={{ color: "var(--gold)" }}>
            ADMIN PANEL
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all",
                active
                  ? "text-emerald-deep"
                  : "hover:bg-white/5"
              )}
              style={{
                background: active ? "var(--gold)" : "transparent",
                color: active ? "var(--ink)" : "var(--emerald-mist)",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-white/5 transition-all"
          style={{ color: "var(--emerald-mist)" }}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm hover:bg-white/5 transition-all text-left"
          style={{ color: "var(--emerald-mist)" }}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
