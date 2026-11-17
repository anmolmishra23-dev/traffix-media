import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let client: SupabaseClient | null = null;

/**
 * Browser client for the admin panel. The login session is kept in the browser,
 * so the admin works on static hosting (GitHub Pages) as well as on Vercel.
 * What a logged-in user may change is enforced by Row Level Security in the database.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || typeof window === "undefined") return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "traffix-admin-auth" },
    });
  }
  return client;
}
