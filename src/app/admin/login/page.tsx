import Image from "next/image";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  if (!isSupabaseConfigured) return null; // the admin layout shows setup instructions instead

  // Already signed in as an admin? Go straight to the dashboard.
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) redirect("/admin");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Image src="/brand/logo-nav.png" alt="Traffix Media" width={583} height={210} className="mx-auto h-12 w-auto" priority />
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your website content.</p>
          {(error === "not-admin" || (user && !error)) && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {user?.email ? `${user.email} doesn't have admin access.` : "This account doesn't have admin access."}
            </p>
          )}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
