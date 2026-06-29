"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please email us directly at hello@balajijewels.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pt-32 pb-20 min-h-screen" style={{ background: "var(--pearl)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-eyebrow mb-3">Get In Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-4" style={{ color: "var(--emerald-deep)" }}>
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--slate)" }}>
            Whether you have a question about custom orders, sizing, or our collections — our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                icon: Phone,
                title: "Phone",
                lines: ["+91 98765 43210", "Mon–Sat, 10am–7pm IST"],
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["hello@balajijewels.com", "We reply within 24 hours"],
              },
              {
                icon: MapPin,
                title: "Showroom",
                lines: ["12, Zaveri Bazaar", "Mumbai, Maharashtra 400002"],
              },
              {
                icon: Clock,
                title: "Hours",
                lines: ["Monday–Saturday: 10am–8pm", "Sunday: 11am–6pm"],
              },
            ].map(({ icon: Icon, title, lines }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-sm"
                style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "var(--emerald-fog)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--emerald)" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--slate)" }}>
                    {title}
                  </p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm" style={{ color: "var(--ink)" }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-sm p-8"
              style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
            >
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "var(--emerald)" }} />
                  <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--emerald-deep)" }}>
                    Message Sent
                  </h2>
                  <p className="text-sm" style={{ color: "var(--slate)" }}>
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setError(""); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="btn-primary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-serif text-xl font-medium mb-2" style={{ color: "var(--emerald-deep)" }}>
                    Send Us a Message
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { key: "name", label: "Your Name", type: "text", required: true },
                      { key: "email", label: "Email Address", type: "email", required: true },
                    ].map(({ key, label, type, required }) => (
                      <div key={key}>
                        <label
                          className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                          style={{ color: "var(--slate)" }}
                        >
                          {label}
                        </label>
                        <input
                          type={type}
                          required={required}
                          value={(form as Record<string, string>)[key]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                          style={{
                            background: "var(--pearl)",
                            border: "1px solid var(--pearl-dark)",
                            color: "var(--ink)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--slate)" }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="Custom order, sizing question, etc."
                      className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                      style={{
                        background: "var(--pearl)",
                        border: "1px solid var(--pearl-dark)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: "var(--slate)" }}
                    >
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help…"
                      className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none resize-none"
                      style={{
                        background: "var(--pearl)",
                        border: "1px solid var(--pearl-dark)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                  {error && (
                    <p className="text-sm rounded p-3" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" disabled={sending} className="btn-primary w-full">
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
