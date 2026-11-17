import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Admin | Traffix Media",
  robots: { index: false, follow: false },
};

// The admin runs entirely in the browser (works on GitHub Pages and Vercel).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900">
      <AdminApp>{children}</AdminApp>
    </div>
  );
}
