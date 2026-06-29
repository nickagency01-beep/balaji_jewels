import type { Metadata } from "next";
import AdminGuard from "./AdminGuard";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin — LUMORA", template: "%s | Admin LUMORA" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen" style={{ background: "var(--pearl)" }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
