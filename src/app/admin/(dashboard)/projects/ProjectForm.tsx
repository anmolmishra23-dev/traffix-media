import Image from "next/image";
import { SubmitButton } from "@/components/admin/buttons";
import { Card, Checkbox, Field, inputClass } from "@/components/admin/ui";
import type { Category, Project } from "@/lib/types";
import { saveProject } from "../../actions";

export function ProjectForm({ project, categories }: { project?: Project; categories: Category[] }) {
  return (
    <form action={saveProject} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

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
        <Field label="Cover image" hint="Shown on cards and at the top of the page. Portrait or square works best. Max 10 MB.">
          {project?.cover_image_url && (
            <div className="mb-3 flex items-center gap-4">
              <div className="relative size-24 overflow-hidden rounded-lg border border-zinc-200">
                <Image src={project.cover_image_url} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <Checkbox name="remove_cover" label="Remove this image" />
            </div>
          )}
          <input name="cover" type="file" accept="image/*" className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium" />
        </Field>

        <Field label="Gallery images" hint="Select several at once. Max 10 MB each.">
          {project && project.gallery.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {project.gallery.map((src) => (
                <label key={src} className="group relative block cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200">
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                    <input type="checkbox" name="remove_gallery" value={src} className="accent-red-600" /> Remove
                  </span>
                </label>
              ))}
            </div>
          )}
          <input name="gallery" type="file" accept="image/*" multiple className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium" />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold">Display</h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox name="published" label="Show on website" defaultChecked={project?.published ?? true} />
          <Checkbox name="featured" label="Feature on home page" defaultChecked={project?.featured ?? false} />
        </div>
        <Field label="Order" hint="Lower numbers appear first." className="max-w-40">
          <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={inputClass} />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton pendingText="Saving & uploading…">{project ? "Save changes" : "Create project"}</SubmitButton>
      </div>
    </form>
  );
}
