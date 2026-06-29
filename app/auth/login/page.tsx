"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed");
      setUser(json.user);
      toast.success(`Welcome back, ${json.user.name}!`);
      router.push(json.user.role === "ADMIN" ? "/admin" : "/account");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ background: "var(--pearl)" }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/">
            <span className="font-serif font-medium tracking-[0.3em] text-2xl" style={{ color: "var(--emerald-deep)" }}>
              LUMORA
            </span>
          </Link>
          <p className="section-eyebrow mt-2">Sign In to Your Account</p>
        </div>

        <div
          className="rounded-sm p-8 shadow-sm"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <h1 className="font-serif text-xl font-medium mb-6" style={{ color: "var(--emerald-deep)" }}>
            Welcome back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--ink-light)" }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register("email")}
                className="input-base"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--ink-light)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className="input-base pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--slate)" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs underline underline-offset-2" style={{ color: "var(--slate)" }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--slate)" }}>
            New to LUMORA?{" "}
            <Link href="/auth/register" className="font-semibold underline underline-offset-2" style={{ color: "var(--emerald)" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
