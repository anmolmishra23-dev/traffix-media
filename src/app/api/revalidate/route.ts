import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

// Called by the admin panel after a save so public pages update immediately on Vercel / Node hosting.
// Not included in the GitHub Pages build (static hosting rebuilds on a schedule instead).
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !isSupabaseConfigured) return Response.json({ ok: false }, { status: 401 });

  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: isAdmin } = await db.rpc("is_admin");
  if (!isAdmin) return Response.json({ ok: false }, { status: 403 });

  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
