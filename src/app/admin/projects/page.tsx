"use client";

import Image from "next/image";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad } from "@/components/admin/hooks";
import { Badge, Flash, Loading, PageHeader } from "@/components/admin/ui";
import type { Project } from "@/lib/types";

export default function ProjectsAdmin() {
  const { db } = useAdmin();
  const { data: projects, error } = useLoad(async () => {
    const { data, error } = await db
      .from("projects")
      .select("*, category:categories(id, name, slug, sort_order)")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data as Project[]) ?? []).sort(
      (a, b) => (a.category?.sort_order ?? 999) - (b.category?.sort_order ?? 999) || a.sort_order - b.sort_order,
    );
  });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Each project gets its own page on the website."
        action={
          <Link href="/admin/projects/edit" className="rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4f121a]">
            + Add project
          </Link>
        }
      />
      <Flash error={error ?? undefined} />
      {!projects ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <ul className="divide-y divide-zinc-100">
            {projects.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/projects/edit?id=${p.id}`} className="flex items-center gap-4 px-4 py-3 transition hover:bg-zinc-50">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#6a1a23]/10">
                    {p.cover_image_url && <Image src={p.cover_image_url} alt="" fill sizes="48px" unoptimized className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-sm text-zinc-500">{p.category?.name ?? "No industry"}</p>
                  </div>
                  <div className="hidden gap-1.5 sm:flex">
                    {p.featured && <Badge tone="maroon">Featured</Badge>}
                    {p.video_url && <Badge>Video</Badge>}
                    {!p.published && <Badge tone="amber">Hidden</Badge>}
                  </div>
                  <span className="text-zinc-400">→</span>
                </Link>
              </li>
            ))}
            {!projects.length && <li className="p-8 text-center text-sm text-zinc-500">No projects yet.</li>}
          </ul>
        </div>
      )}
    </>
  );
}
