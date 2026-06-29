import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, role, passwordHash, provider")
      .eq("email", data.email)
      .single();

    if (!user || user.provider !== "local" || !user.passwordHash) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) return Response.json({ error: "Invalid email or password" }, { status: 401 });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([signAccessToken(payload), signRefreshToken(payload)]);

    await supabase.from("refresh_tokens").insert({
      id: `rt_${Date.now()}`,
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { passwordHash: _, provider: __, ...publicUser } = user;
    const res = Response.json({ user: publicUser });
    setAuthCookies(res, accessToken, refreshToken);
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) return Response.json({ error: err.issues[0].message }, { status: 422 });
    console.error("Login error:", err);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
