import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthProvider from "@/components/layout/AuthProvider";

export const metadata: Metadata = {
  title: { default: "LUMORA — Fine Jewelry", template: "%s | LUMORA" },
  description:
    "Discover LUMORA's collection of handcrafted fine jewelry. Rings, necklaces, earrings, and bracelets in gold, platinum, and precious gemstones.",
  keywords: ["luxury jewelry", "fine jewelry", "diamond rings", "gold necklaces", "LUMORA"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LUMORA Fine Jewelry",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-1 page-enter">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--ink-mid)",
                color: "var(--pearl)",
                borderRadius: "2px",
                fontSize: "0.875rem",
                border: "1px solid rgba(201,168,76,0.3)",
              },
              success: { iconTheme: { primary: "#c9a84c", secondary: "#1c1c1e" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
