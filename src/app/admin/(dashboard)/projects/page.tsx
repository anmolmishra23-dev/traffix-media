import Image from "next/image";
import Link from "next/link";
import { Badge, Flash, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Project } from "@/lib/types";

export const metadata = { title: "Projects" };

export default async function ProjectsAdmin({ searchParams }: PageProps<"/admin/projects">) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(id, name, slug)")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const projects = (data as Project[]) ?? [];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Each project gets its own page on the website."
        action={
          <Link href="/admin/projects/new" className="rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4f121a]">
            + Add project
          </Link>
        }
      />
      <Flash ok={ok} error={error} />
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <ul className="divide-y divide-zinc-100">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-4 px-4 py-3 transition hover:bg-zinc-50">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#6a1a23]/10">
                  {p.cover_image_url && <Image src={p.cover_image_url} alt="" fill sizes="48px" className="object-cover" />}
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
    </>
  );
}
