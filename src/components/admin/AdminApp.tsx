"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { getAdminClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { asset, cn } from "@/lib/utils";
import { ToastProvider } from "./toast";
import { Loading } from "./ui";

type AdminCtx = { db: SupabaseClient; user: User; refreshUnread: () => void };
const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside the admin area");
  return ctx;
}

type AuthState = { status: "loading" } | { status: "signed-out" } | { status: "not-admin"; user: User } | { status: "ok"; user: User };

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/categories", label: "Industries" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/about", label: "About page" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/account", label: "My account" },
];

const noopSubscribe = () => () => {};

/** Current path without a trailing slash (static hosting uses "/admin/", Vercel "/admin"). */
function usePath() {
  return (usePathname() || "/").replace(/(.)\/$/, "$1");
}

/** Wraps every /admin page: toasts, login check, sidebar and the database client. */
export function AdminApp({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminGate>{children}</AdminGate>
    </ToastProvider>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePath();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  // The page is pre-built without a browser; only create the client once running in the browser,
  // so the first render matches the pre-built HTML.
  const isBrowser = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const db = isBrowser ? getAdminClient() : null;
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    if (!db) return;
    let active = true;
    const check = async (user: User | null) => {
      if (!user) return active && setAuth({ status: "signed-out" });
      const { data: isAdmin } = await db.rpc("is_admin");
      if (active) setAuth(isAdmin ? { status: "ok", user } : { status: "not-admin", user });
    };
    db.auth.getSession().then(({ data }) => check(data.session?.user ?? null));
    // Supabase recommends not awaiting other Supabase calls directly inside this callback.
    const { data: sub } = db.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => check(session?.user ?? null), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    if (auth.status === "signed-out" && !isLogin) router.replace("/admin/login");
    if (auth.status === "ok" && isLogin) router.replace("/admin");
  }, [auth.status, isLogin, router]);

  if (!isSupabaseConfigured) return <SetupNotice />;
  if (isLogin) return <>{children}</>;
  if (!db) return <Loading />;
  if (auth.status === "loading" || auth.status === "signed-out") return <Loading />;
  if (auth.status === "not-admin") {
    return (
      <Centered>
        <p className="font-semibold">{auth.user.email} doesn&apos;t have admin access.</p>
        <button onClick={() => db.auth.signOut()} className="mt-4 text-sm font-medium text-[#6a1a23]">
          Sign out
        </button>
      </Centered>
    );
  }

  return (
    <Shell db={db} user={auth.user}>
      {children}
    </Shell>
  );
}

function Shell({ db, user, children }: { db: SupabaseClient; user: User; children: React.ReactNode }) {
  const pathname = usePath();
  const [unread, setUnread] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    db.from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => active && setUnread(count ?? 0));
    return () => {
      active = false;
    };
  }, [db, pathname, tick]);

  const signOut = () => db.auth.signOut();

  return (
    <Ctx.Provider value={{ db, user, refreshUnread: () => setTick((t) => t + 1) }}>
      <div className="md:flex">
        <aside className="border-b border-zinc-200 bg-white md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:border-r md:border-b-0">
          <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
            <Link href="/admin">
              <Image src={asset("/brand/logo-nav.png")} alt="Traffix Media" width={583} height={210} className="h-8 w-auto" />
            </Link>
            <Link href="/" target="_blank" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 md:mt-3 md:block">
              View website ↗
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
            {nav.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition",
                    active ? "bg-[#6a1a23] text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                  )}
                >
                  {item.label}
                  {item.href === "/admin/enquiries" && unread > 0 && (
                    <span className={cn("rounded-full px-1.5 text-xs font-bold", active ? "bg-white text-[#6a1a23]" : "bg-[#6a1a23] text-white")}>
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="hidden border-t border-zinc-200 p-4 md:mt-auto md:block">
            <Link href="/admin/account" className="block truncate text-xs text-zinc-500 hover:text-zinc-900" title="My account · change password">
              {user.email}
            </Link>
            <button onClick={signOut} className="mt-2 text-sm font-medium text-zinc-700 hover:text-[#6a1a23]">
              Sign out
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:p-10">
          <div className="mx-auto max-w-5xl">{children}</div>
          <button onClick={signOut} className="mt-10 text-sm font-medium text-zinc-600 md:hidden">
            Sign out ({user.email})
          </button>
        </main>
      </div>
    </Ctx.Provider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">{children}</div>
    </div>
  );
}

function SetupNotice() {
  return (
    <Centered>
      <h1 className="text-lg font-bold">Admin isn&apos;t connected yet</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Set <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (in <code>.env.local</code> locally, or as
        repository secrets / host environment variables), then rebuild. See README.
      </p>
    </Centered>
  );
}
