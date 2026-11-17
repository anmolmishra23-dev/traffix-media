"use client";

import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad } from "@/components/admin/hooks";
import { Badge, Card, Loading, PageHeader } from "@/components/admin/ui";
import type { Enquiry } from "@/lib/types";

export default function AdminHome() {
  const { db } = useAdmin();
  const { data } = useLoad(async () => {
    const count = async (table: string) => (await db.from(table).select("id", { count: "exact", head: true })).count ?? 0;
    const [projects, categories, services, testimonials, enquiries, recent] = await Promise.all([
      count("projects"),
      count("categories"),
      count("services"),
      count("testimonials"),
      count("enquiries"),
      db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5),
    ]);
    return { projects, categories, services, testimonials, enquiries, recent: (recent.data as Enquiry[]) ?? [] };
  });

  const stats = data
    ? [
        { label: "Projects", value: data.projects, href: "/admin/projects" },
        { label: "Industries", value: data.categories, href: "/admin/categories" },
        { label: "Services", value: data.services, href: "/admin/services" },
        { label: "Testimonials", value: data.testimonials, href: "/admin/testimonials" },
        { label: "Enquiries", value: data.enquiries, href: "/admin/enquiries" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Manage the content of your website."
        action={
          <Link href="/admin/projects/edit" className="rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4f121a]">
            + Add project
          </Link>
        }
      />
      {!data ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s) => (
              <Link key={s.label} href={s.href}>
                <Card className="transition hover:border-[#6a1a23]/40">
                  <p className="text-sm text-zinc-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold">{s.value}</p>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Latest enquiries</h2>
              <Link href="/admin/enquiries" className="text-sm font-medium text-[#6a1a23]">
                View all →
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-zinc-100">
              {data.recent.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {e.name} {e.company && <span className="font-normal text-zinc-500">· {e.company}</span>}
                    </p>
                    <p className="truncate text-sm text-zinc-500">{e.message}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {!e.is_read && <Badge tone="maroon">New</Badge>}
                    <p className="mt-1 text-xs text-zinc-400">{new Date(e.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                </li>
              ))}
              {!data.recent.length && <li className="py-6 text-center text-sm text-zinc-500">No enquiries yet.</li>}
            </ul>
          </Card>
        </>
      )}
    </>
  );
}
