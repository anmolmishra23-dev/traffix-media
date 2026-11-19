"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Field, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { deleteRow, int, optional, refreshSite, saveRow, savedMessage, text } from "@/lib/admin-api";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/utils";

export default function CategoriesAdmin() {
  const { db } = useAdmin();
  const { pending, run } = useTask();
  const { data, reload } = useLoad(async () => {
    const [{ data: categories }, { data: projects }] = await Promise.all([
      db.from("categories").select("*").order("sort_order"),
      db.from("projects").select("category_id"),
    ]);
    return { categories: (categories as Category[]) ?? [], projects: projects ?? [] };
  });

  const usage = (id: string) => data?.projects.filter((p) => p.category_id === id).length ?? 0;

  const save = (e: FormEvent<HTMLFormElement>, id: string | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const name = text(fd, "name");
      if (!name) throw new Error("Name is required.");
      await saveRow(db, "categories", id, { name, slug: slugify(optional(fd, "slug") ?? name), sort_order: int(fd, "sort_order") });
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Industry saved" : "Industry added", await refreshSite(db));
    });
  };

  const remove = (c: Category) => {
    const n = usage(c.id);
    if (!window.confirm(`Delete "${c.name}"?${n ? ` ${n} project(s) will become uncategorised.` : ""}`)) return;
    run(async () => {
      await deleteRow(db, "categories", c.id);
      reload();
      return savedMessage("Industry deleted", await refreshSite(db));
    });
  };

  return (
    <>
      <PageHeader title="Industries" description="Used to group projects on the Work page and the home page." />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add an industry</h2>
        <form onSubmit={(e) => save(e, null)} className="grid gap-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
          <Field label="Name">
            <input name="name" required className={inputClass} placeholder="e.g. Hospitality" />
          </Field>
          <Field label="Order">
            <input name="sort_order" type="number" defaultValue={(data?.categories.length ?? 0) + 1} className={inputClass} />
          </Field>
          <Button pending={pending}>Add</Button>
        </form>
      </Card>

      {!data ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {data.categories.map((c) => (
            <Card key={`${c.id}-${c.name}-${c.slug}-${c.sort_order}`} className="p-4 md:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <form onSubmit={(e) => save(e, c.id)} className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end">
                  <Field label="Name">
                    <input name="name" required defaultValue={c.name} className={inputClass} />
                  </Field>
                  <Field label="Slug">
                    <input name="slug" defaultValue={c.slug} className={inputClass} />
                  </Field>
                  <Field label="Order">
                    <input name="sort_order" type="number" defaultValue={c.sort_order} className={inputClass} />
                  </Field>
                  <Button variant="secondary" pending={pending}>
                    Save
                  </Button>
                </form>
                <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove(c)}>
                  Delete
                </Button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">{usage(c.id)} project(s)</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
