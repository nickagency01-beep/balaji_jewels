"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user !== null && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (user === null) return null;
  if (user.role !== "ADMIN") return null;

  return <>{children}</>;
}
