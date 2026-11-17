import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

let client: SupabaseClient | null = null;

const isServer = typeof window === "undefined";
const isStaticExport = process.env.STATIC_EXPORT === "1";

/**
 * Cookie-less client for public content (and the contact form in the browser).
 * Because it never reads cookies, public pages stay statically rendered (good for SEO and speed).
 *
 * On a Node host (Vercel), content requests are cached and refreshed hourly; admin saves refresh
 * pages immediately via revalidatePath. In a static export (GitHub Pages) data is read once at build time.
 */
export function getPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global:
        isServer && !isStaticExport
          ? { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600 } }) }
          : undefined,
    });
  }
  return client;
}
