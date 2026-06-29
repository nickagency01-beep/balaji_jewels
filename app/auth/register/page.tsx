"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Registration failed");
      setUser(json.user);
      toast.success("Welcome to LUMORA!");
      router.push("/account");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
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
        <div className="text-center mb-10">
          <Link href="/">
            <span
              className="font-serif font-medium tracking-[0.3em] text-2xl"
              style={{ color: "var(--emerald-deep)" }}
            >
              LUMORA
            </span>
          </Link>
          <p className="section-eyebrow mt-2">Create Your Account</p>
        </div>

        <div
          className="rounded-sm p-8 shadow-sm"
          style={{ background: "var(--white)", border: "1px solid var(--pearl-dark)" }}
        >
          <h1
            className="font-serif text-xl font-medium mb-6"
            style={{ color: "var(--emerald-deep)" }}
          >
            Join the LUMORA Circle
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--ink-light)" }}>
                Full Name
              </label>
              <input
                type="text"
                autoComplete="name"
                {...register("name")}
                className="input-base"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.name.message}</p>
              )}
            </div>

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
                  autoComplete="new-password"
                  {...register("password")}
                  className="input-base pr-10"
                  placeholder="Min 8 characters"
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

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: "var(--ink-light)" }}>
                Confirm Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirm")}
                className="input-base"
                placeholder="Repeat password"
              />
              {errors.confirm && (
                <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>{errors.confirm.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--slate)" }}>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--emerald)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
