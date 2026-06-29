"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Users, Mail, Phone, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpend: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      setCustomers(data.customers ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-medium mb-1" style={{ color: "var(--emerald-deep)" }}>
          Customers
        </h1>
        <p className="text-sm" style={{ color: "var(--slate)" }}>
          {total} registered customer{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--slate-light)" }} />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base w-full pl-9"
        />
      </div>

      <div
        className="rounded-sm overflow-hidden"
        style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
      >
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--pearl-dark)" }} />
            <p className="text-sm" style={{ color: "var(--slate)" }}>No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--pearl-dark)" }}>
                  {["Customer", "Contact", "Role", "Orders", "Total Spend", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 font-medium"
                      style={{ color: "var(--slate)", fontSize: "0.75rem" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--pearl-dark)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--pearl)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td className="px-5 py-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold inline-flex mr-3"
                        style={{ background: "var(--emerald-fog)", color: "var(--emerald-deep)" }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: "var(--ink)" }}>{c.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5" style={{ color: "var(--slate)" }}>
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs truncate max-w-[160px]">{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5" style={{ color: "var(--slate)" }}>
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs">{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm"
                        style={{
                          background: c.role === "ADMIN" ? "var(--gold-whisper)" : "var(--emerald-fog)",
                          color: c.role === "ADMIN" ? "var(--gold-deep)" : "var(--emerald)",
                        }}
                      >
                        {c.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
                        <ShoppingBag className="w-3.5 h-3.5" style={{ color: "var(--slate-light)" }} />
                        {c.orderCount}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--emerald-deep)" }}>
                      {formatPrice(c.totalSpend)}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--slate)" }}>
                      {new Date(c.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: "var(--pearl-dark)" }}
          >
            <p className="text-xs" style={{ color: "var(--slate)" }}>
              Page {page} of {totalPages} · {total} customers
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-sm border transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--pearl-dark)", color: "var(--ink)" }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-sm border transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--pearl-dark)", color: "var(--ink)" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
