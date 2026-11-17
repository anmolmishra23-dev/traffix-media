"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { inputClass } from "@/components/admin/ui";
import { getAdminClient } from "@/lib/supabase/browser";
import { asset } from "@/lib/utils";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = getAdminClient();
    if (!db) return;
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error: authError } = await db.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    });
    if (authError) {
      setError("Incorrect email or password.");
      setPending(false);
      return;
    }
    const { data: isAdmin } = await db.rpc("is_admin");
    if (!isAdmin) {
      await db.auth.signOut();
      setError("This account doesn't have admin access.");
      setPending(false);
    }
    // On success the admin wrapper notices the new session and opens the dashboard.
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Image src={asset("/brand/logo-nav.png")} alt="Traffix Media" width={583} height={210} className="mx-auto h-12 w-auto" priority />
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage your website content.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
              <input name="email" type="email" autoComplete="email" required className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Password</span>
              <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
            </label>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4f121a] disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
