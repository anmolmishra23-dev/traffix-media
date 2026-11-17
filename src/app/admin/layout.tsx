import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | Traffix Media" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-900">
        <div className="max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold">Connect Supabase to use the admin panel</h1>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-600">
            <li>Create a project at supabase.com.</li>
            <li>
              Run <code className="rounded bg-zinc-100 px-1">supabase/schema.sql</code> and then{" "}
              <code className="rounded bg-zinc-100 px-1">supabase/seed.sql</code> in the SQL Editor.
            </li>
            <li>
              Copy <code className="rounded bg-zinc-100 px-1">.env.example</code> to{" "}
              <code className="rounded bg-zinc-100 px-1">.env.local</code> and add your project URL and anon key.
            </li>
            <li>Create the admin user and add their email to the admin_users table (see README).</li>
            <li>Restart the dev server.</li>
          </ol>
        </div>
      </div>
    );
  }
  return <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900">{children}</div>;
}
