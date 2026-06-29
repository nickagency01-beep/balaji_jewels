"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Plus, Pencil, Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, METAL_LABELS } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  metalType: string;
  category: { name: string };
  images: { url: string }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [page]);

  async function loadProducts() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  async function toggleActive(productId: string, current: boolean) {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, isActive: !current }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !current } : p))
      );
      toast.success(current ? "Product hidden" : "Product published");
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm("Hide this product? It won't appear in the storefront.")) return;
    await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Product hidden");
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium" style={{ color: "var(--emerald-deep)" }}>
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>{total} products</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => toast("Product creation form — connect to a modal or dedicated page")}
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 border rounded-sm px-3 py-2 mb-6 max-w-xs"
        style={{ borderColor: "var(--pearl-dark)", background: "var(--white)" }}
      >
        <Search className="w-4 h-4" style={{ color: "var(--slate)" }} />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadProducts()}
          className="text-sm outline-none bg-transparent flex-1"
        />
      </div>

      {/* Grid */}
      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--pearl-dark)" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "var(--pearl-mid)" }}>
            <tr>
              {["Product", "SKU", "Metal", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--slate)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--pearl-dark)" }}>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : products.map((p) => (
                  <tr key={p.id} style={{ background: "var(--white)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <Image
                            src={p.images[0].url}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded-sm flex-shrink-0"
                            style={{ background: "var(--pearl-mid)" }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--emerald-fog)" }}
                          >
                            <Package className="w-5 h-5" style={{ color: "var(--emerald-light)" }} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium" style={{ color: "var(--ink)" }}>{p.name}</p>
                          <p className="text-xs" style={{ color: "var(--slate)" }}>{p.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--slate)" }}>
                      {p.sku}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--slate)" }}>
                      {METAL_LABELS[p.metalType] ?? p.metalType}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--emerald-deep)" }}>
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                        style={{
                          background: p.stock < 5 ? "#fee2e2" : "var(--emerald-fog)",
                          color: p.stock < 5 ? "#991b1b" : "var(--emerald)",
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p.id, p.isActive)}
                        className="text-xs font-semibold px-2 py-0.5 rounded-sm"
                        style={{
                          background: p.isActive ? "#dcfce7" : "#f3f4f6",
                          color: p.isActive ? "#14532d" : "#6b7280",
                        }}
                      >
                        {p.isActive ? "Published" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toast(`Edit product ${p.id}`)}
                          className="p-1.5 rounded transition-colors hover:bg-pearl-mid"
                          style={{ color: "var(--slate)" }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded transition-colors hover:bg-red-50"
                          style={{ color: "#b91c1c" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && products.length === 0 && (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--pearl-dark)" }} />
            <p style={{ color: "var(--slate)" }}>No products found</p>
          </div>
        )}
      </div>

      {Math.ceil(total / 20) > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 20) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className="w-8 h-8 rounded-sm text-xs font-medium"
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
    </div>
  );
}
