"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Checkbox, Field, Flash, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { bool, deleteRow, int, optional, refreshSite, saveRow, savedMessage, text } from "@/lib/admin-api";
import type { Project, Testimonial } from "@/lib/types";

export default function TestimonialsAdmin() {
  const { db } = useAdmin();
  const { pending, flash, run } = useTask();
  const { data, reload } = useLoad(async () => {
    const [t, p] = await Promise.all([
      db.from("testimonials").select("*").order("sort_order"),
      db.from("projects").select("id, title").order("title"),
    ]);
    return { items: (t.data as Testimonial[]) ?? [], projects: (p.data as Pick<Project, "id" | "title">[]) ?? [] };
  });
  const items = data?.items ?? null;
  const projects = data?.projects ?? [];

  const save = (e: FormEvent<HTMLFormElement>, id: string | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const name = text(fd, "name");
      const quote = text(fd, "quote");
      if (!name || !quote) throw new Error("Name and quote are required.");
      await saveRow(db, "testimonials", id, {
        name,
        quote,
        role: optional(fd, "role"),
        company: optional(fd, "company"),
        project_id: optional(fd, "project_id"),
        published: bool(fd, "published"),
        sort_order: int(fd, "sort_order"),
      });
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Testimonial saved" : "Testimonial added", await refreshSite(db));
    });
  };

  const remove = (t: Testimonial) => {
    if (!window.confirm(`Delete testimonial from ${t.name}?`)) return;
    run(async () => {
      await deleteRow(db, "testimonials", t.id);
      reload();
      return savedMessage("Testimonial deleted", await refreshSite(db));
    });
  };

  const fields = (t?: Testimonial) => (
    <form onSubmit={(e) => save(e, t?.id ?? null)} className="grid gap-4 sm:grid-cols-3">
      <Field label="Name *">
        <input name="name" required defaultValue={t?.name} className={inputClass} />
      </Field>
      <Field label="Role">
        <input name="role" defaultValue={t?.role ?? ""} className={inputClass} placeholder="Marketing Head" />
      </Field>
      <Field label="Company">
        <input name="company" defaultValue={t?.company ?? ""} className={inputClass} />
      </Field>
      <Field label="Linked project" hint="Shows that brand's logo and work beside the quote." className="sm:col-span-3">
        <select name="project_id" defaultValue={t?.project_id ?? ""} className={inputClass}>
          <option value="">— None —</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Quote *" className="sm:col-span-3">
        <textarea name="quote" required rows={3} defaultValue={t?.quote} className={inputClass} />
      </Field>
      <div className="flex flex-wrap items-center gap-6 sm:col-span-3">
        <Checkbox name="published" label="Show on website" defaultChecked={t?.published ?? true} />
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          Order
          <input name="sort_order" type="number" defaultValue={t?.sort_order ?? (items?.length ?? 0) + 1} className={`${inputClass} w-20`} />
        </label>
        <Button variant={t ? "secondary" : "primary"} pending={pending}>
          {t ? "Save" : "Add testimonial"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader title="Testimonials" description="Client reviews. The section appears on the home page as soon as one is published." />
      <Flash ok={flash.ok} error={flash.error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add a testimonial</h2>
        {fields()}
      </Card>

      {!items ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={`${t.id}-${t.name}-${t.quote}-${t.published}-${t.sort_order}-${t.project_id}`}>
              {fields(t)}
              <div className="mt-3">
                <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove(t)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
