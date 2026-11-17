"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/categories", label: "Industries" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/account", label: "My account" },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
      {items.map((item) => {
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
  );
}
