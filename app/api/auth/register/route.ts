import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { data: existing } = await supabase.from("users").select("id").eq("email", data.email).single();
    if (existing) return Response.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(data.password, 12);
    const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const { data: user, error } = await supabase
      .from("users")
      .insert({ id, name: data.name, email: data.email, passwordHash, role: "CUSTOMER" })
      .select("id, email, name, role")
      .single();

    if (error || !user) throw error ?? new Error("Failed to create user");

    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([signAccessToken(payload), signRefreshToken(payload)]);

    await supabase.from("refresh_tokens").insert({
      id: `rt_${Date.now()}`,
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const res = Response.json({ user });
    setAuthCookies(res, accessToken, refreshToken);
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) return Response.json({ error: err.issues[0].message }, { status: 422 });
    console.error("Register error:", err);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
