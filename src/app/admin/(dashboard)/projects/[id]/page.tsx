import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/admin/buttons";
import { Flash, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Category, Project } from "@/lib/types";
import { deleteProject } from "../../../actions";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "Edit project" };

export default async function EditProject({ params, searchParams }: PageProps<"/admin/projects/[id]">) {
  const [{ id }, { ok, error }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const [{ data: project }, { data: categories }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!project) notFound();
  const p = project as Project;

  return (
    <>
      <Link href="/admin/projects" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← All projects
      </Link>
      <div className="mt-3">
        <PageHeader
          title={p.title}
          action={
            p.published ? (
              <Link href={`/work/${p.slug}`} target="_blank" className="text-sm font-medium text-[#6a1a23]">
                View on website ↗
              </Link>
            ) : undefined
          }
        />
      </div>
      <Flash ok={ok} error={error} />
      <ProjectForm project={p} categories={(categories as Category[]) ?? []} />

      <form action={deleteProject} className="mt-10 border-t border-zinc-200 pt-6">
        <input type="hidden" name="id" value={p.id} />
        <SubmitButton variant="danger" pendingText="Deleting…" confirm={`Delete "${p.title}"? This cannot be undone.`}>
          Delete project
        </SubmitButton>
      </form>
    </>
  );
}
