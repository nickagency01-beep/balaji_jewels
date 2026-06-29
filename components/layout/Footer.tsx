import Link from "next/link";
import { Share2, Rss, PlayCircle, Mail, Phone, MapPin } from "lucide-react";

const LINKS = {
  Shop: [
    { label: "Rings", href: "/catalog?category=rings" },
    { label: "Necklaces", href: "/catalog?category=necklaces" },
    { label: "Earrings", href: "/catalog?category=earrings" },
    { label: "Bracelets", href: "/catalog?category=bracelets" },
    { label: "New Arrivals", href: "/catalog?sort=newest" },
    { label: "Bestsellers", href: "/catalog?sort=featured" },
  ],
  Services: [
    { label: "Design Your Own", href: "/designer" },
    { label: "Ring Sizing Guide", href: "/sizing-guide" },
    { label: "Metal Guide", href: "/metal-guide" },
    { label: "Gemstone Guide", href: "/gemstone-guide" },
    { label: "Certification", href: "/certification" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Press", href: "/press" },
    { label: "Contact Us", href: "/contact" },
  ],
  Support: [
    { label: "My Account", href: "/account" },
    { label: "Order Tracking", href: "/account/orders" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Care Instructions", href: "/care" },
    { label: "FAQ", href: "/faq" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: "var(--emerald-deep)",
        borderColor: "rgba(201,168,76,0.15)",
        color: "var(--pearl-mid)",
      }}
    >
      {/* Newsletter */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(201,168,76,0.12)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-eyebrow mb-2" style={{ color: "var(--gold)" }}>
              Stay in the Light
            </p>
            <h3
              className="font-serif text-2xl font-medium"
              style={{ color: "var(--pearl)" }}
            >
              Join the LUMORA Circle
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--emerald-mist)" }}>
              Early access to new collections, private events, and care guides.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm gap-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm bg-white/5 border border-white/10 text-pearl placeholder-emerald-mist/50 rounded-l-sm outline-none focus:border-gold/50 transition-colors"
              style={{ color: "var(--pearl)", borderColor: "rgba(255,255,255,0.1)" }}
            />
            <button
              type="submit"
              className="px-5 py-3 text-sm font-semibold tracking-widest uppercase transition-all hover:brightness-110"
              style={{
                background: "var(--gold)",
                color: "var(--ink)",
                borderRadius: "0 2px 2px 0",
              }}
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="mb-4">
              <span
                className="font-serif font-medium tracking-[0.3em] text-xl"
                style={{ color: "var(--pearl)" }}
              >
                LUMORA
              </span>
              <div
                className="text-[0.45rem] tracking-[0.4em] font-medium mt-0.5"
                style={{ color: "var(--gold)" }}
              >
                FINE JEWELRY
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--emerald-mist)" }}>
              Handcrafted in ethically sourced gold and precious stones. Each piece tells a story of light, craft, and enduring beauty.
            </p>
            <div className="flex gap-3">
              {[Share2, Rss, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    color: "var(--gold)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: "var(--gold)" }}
              >
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-pearl"
                      style={{ color: "var(--emerald-mist)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & certifications */}
        <div
          className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          style={{ borderColor: "rgba(201,168,76,0.12)" }}
        >
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: "var(--emerald-mist)" }}>
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
              hello@lumora.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
              +1 (800) LUMORA-1
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
              Mumbai · New York · Dubai
            </span>
          </div>
          <div className="flex gap-4">
            {["GIA Certified", "BIS Hallmarked", "Conflict-Free"].map((cert) => (
              <span
                key={cert}
                className="text-xs px-3 py-1.5 rounded-sm font-medium"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "var(--gold)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div
          className="mt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs"
          style={{ color: "var(--emerald-light)" }}
        >
          <p>© {new Date().getFullYear()} LUMORA Fine Jewelry. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link href="/accessibility" className="hover:text-gold transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
