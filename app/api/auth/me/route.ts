import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return Response.json({ user: null }, { status: 401 });

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, role, phone")
      .eq("id", session.sub)
      .single();

    if (!user) return Response.json({ user: null }, { status: 401 });
    return Response.json({ user });
  } catch {
    return Response.json({ user: null }, { status: 500 });
  }
}
