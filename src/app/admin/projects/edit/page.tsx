"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Checkbox, Field, Flash, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { deleteProject, refreshSite, saveProject, savedMessage } from "@/lib/admin-api";
import type { Category, Project } from "@/lib/types";

// One page for both "new project" (/admin/projects/edit) and "edit" (/admin/projects/edit?id=…)
// so it works on static hosting, where every page must exist at build time.
export default function EditProjectPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditProject />
    </Suspense>
  );
}

const fileInput =
  "block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium";

function EditProject() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const { db } = useAdmin();
  const { pending, flash, setFlash, run } = useTask();

  const { data, error, reload } = useLoad(async () => {
    const [cats, proj] = await Promise.all([
      db.from("categories").select("*").order("sort_order"),
      id ? db.from("projects").select("*").eq("id", id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    return { categories: (cats.data as Category[]) ?? [], project: (proj.data as Project | null) ?? null };
  }, id ?? "new");

  if (error) return <Flash error={error} />;
  if (!data) return <Loading />;
  const { categories, project } = data;
  if (id && !project) return <Flash error="Project not found." />;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(async () => {
      const savedId = await saveProject(db, fd, project);
      const live = await refreshSite(db);
      if (!project) router.replace(`/admin/projects/edit?id=${savedId}`);
      else reload();
      return savedMessage(project ? "Project saved" : "Project created", live);
    });
  };

  const onDelete = () => {
    if (!project || !window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    run(async () => {
      await deleteProject(db, project);
      await refreshSite(db);
      router.push("/admin/projects");
    });
  };

  return (
    <>
      <Link href="/admin/projects" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← All projects
      </Link>
      <div className="mt-3">
        <PageHeader
          title={project?.title ?? "New project"}
          action={
            project?.published ? (
              <Link href={`/work/${project.slug}`} target="_blank" className="text-sm font-medium text-[#6a1a23]">
                View on website ↗
              </Link>
            ) : undefined
          }
        />
      </div>
      <Flash ok={flash.ok} error={flash.error} />

      {/* key: re-mount the form with fresh values after each save */}
      <form key={`${project?.id}-${project?.cover_image_url}-${project?.gallery.length}`} onSubmit={onSubmit} onChange={() => flash.ok && setFlash({})} className="space-y-6">
        <Card className="space-y-5">
          <h2 className="font-semibold">Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Client / project name *">
              <input name="title" required defaultValue={project?.title} className={inputClass} placeholder="e.g. Grand Hyatt" />
            </Field>
            <Field label="Industry">
              <select name="category_id" defaultValue={project?.category_id ?? ""} className={inputClass}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="URL slug" hint="Leave empty to create it from the name. Changing it changes the page address.">
            <div className="flex items-center rounded-lg border border-zinc-300 bg-zinc-50 text-sm focus-within:border-[#6a1a23]">
              <span className="pl-3 text-zinc-500">/work/</span>
              <input name="slug" defaultValue={project?.slug} className="w-full bg-transparent px-1 py-2.5 outline-none" placeholder="grand-hyatt" />
            </div>
          </Field>
          <Field label="Short summary" hint="1–2 sentences. Shown under the title and used by Google as the page description.">
            <textarea name="summary" rows={2} maxLength={300} defaultValue={project?.summary ?? ""} className={inputClass} />
          </Field>
          <Field label="Full description" hint="Leave a blank line between paragraphs.">
            <textarea name="description" rows={7} defaultValue={project?.description ?? ""} className={inputClass} />
          </Field>
          <Field label="Video link" hint="YouTube, YouTube Shorts, Vimeo or Instagram Reel link. It will be embedded on the page.">
            <input name="video_url" type="url" defaultValue={project?.video_url ?? ""} className={inputClass} placeholder="https://www.instagram.com/reel/…" />
          </Field>
        </Card>

        <Card className="space-y-5">
          <h2 className="font-semibold">Images</h2>
          <Field label="Cover image" hint="Shown on cards and at the top of the page. Portrait or square works best. Keep it under ~1 MB for fast loading (max 10 MB).">
            {project?.cover_image_url && (
              <div className="mb-3 flex items-center gap-4">
                <div className="relative size-24 overflow-hidden rounded-lg border border-zinc-200">
                  <Image src={project.cover_image_url} alt="" fill sizes="96px" unoptimized className="object-cover" />
                </div>
                <Checkbox name="remove_cover" label="Remove this image" />
              </div>
            )}
            <input name="cover" type="file" accept="image/*" className={fileInput} />
          </Field>

          <Field label="Gallery images" hint="Select several at once.">
            {project && project.gallery.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {project.gallery.map((src) => (
                  <label key={src} className="block cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200">
                      <Image src={src} alt="" fill sizes="120px" unoptimized className="object-cover" />
                    </div>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                      <input type="checkbox" name="remove_gallery" value={src} className="accent-red-600" /> Remove
                    </span>
                  </label>
                ))}
              </div>
            )}
            <input name="gallery" type="file" accept="image/*" multiple className={fileInput} />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">Display</h2>
          <div className="flex flex-wrap gap-6">
            <Checkbox name="published" label="Show on website" defaultChecked={project?.published ?? true} />
            <Checkbox name="featured" label="Feature on home page" defaultChecked={project?.featured ?? false} />
          </div>
          <Field label="Order" hint="Lower numbers appear first within the industry." className="max-w-40">
            <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={inputClass} />
          </Field>
        </Card>

        <Button pending={pending} pendingText="Saving & uploading…">
          {project ? "Save changes" : "Create project"}
        </Button>
      </form>

      {project && (
        <div className="mt-10 border-t border-zinc-200 pt-6">
          <Button type="button" variant="danger" pending={pending} pendingText="Working…" onClick={onDelete}>
            Delete project
          </Button>
        </div>
      )}
    </>
  );
}
