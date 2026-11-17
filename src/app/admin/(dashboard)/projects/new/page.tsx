import Link from "next/link";
import { Flash, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "New project" };

export default async function NewProject({ searchParams }: PageProps<"/admin/projects/new">) {
  const { error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <>
      <Link href="/admin/projects" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← All projects
      </Link>
      <div className="mt-3">
        <PageHeader title="New project" />
      </div>
      <Flash error={error} />
      <ProjectForm categories={(data as Category[]) ?? []} />
    </>
  );
}
