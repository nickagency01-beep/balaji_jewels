import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await supabase.from("refresh_tokens").delete().eq("token", refreshToken).catch(() => {});
  }

  const res = Response.json({ ok: true });
  const cookieOpts = "HttpOnly; Path=/; Max-Age=0; SameSite=Strict";
  res.headers.append("Set-Cookie", `access_token=; ${cookieOpts}`);
  res.headers.append("Set-Cookie", `refresh_token=; HttpOnly; Path=/api/auth; Max-Age=0; SameSite=Strict`);
  return res;
}
