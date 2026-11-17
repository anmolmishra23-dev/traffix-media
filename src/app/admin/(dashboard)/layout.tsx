import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";
import { AdminNav } from "./AdminNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const { count: unread } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div className="md:flex">
      <aside className="border-b border-zinc-200 bg-white md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
          <Link href="/admin">
            <Image src="/brand/logo-nav.png" alt="Traffix Media" width={583} height={210} className="h-8 w-auto" />
          </Link>
          <Link href="/" target="_blank" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 md:mt-3 md:block">
            View website ↗
          </Link>
        </div>
        <AdminNav unread={unread ?? 0} />
        <div className="hidden border-t border-zinc-200 p-4 md:mt-auto md:block">
          <Link href="/admin/account" className="block truncate text-xs text-zinc-500 hover:text-zinc-900" title="My account · change password">
            {user.email}
          </Link>
          <form action={signOut} className="mt-2">
            <button className="text-sm font-medium text-zinc-700 hover:text-[#6a1a23]">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <form action={signOut} className="mt-10 md:hidden">
          <button className="text-sm font-medium text-zinc-600">Sign out ({user.email})</button>
        </form>
      </main>
    </div>
  );
}
