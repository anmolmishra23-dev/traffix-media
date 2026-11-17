"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Field, Flash, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { deleteRow, int, optional, refreshSite, saveRow, savedMessage, text } from "@/lib/admin-api";
import type { Service } from "@/lib/types";

export default function ServicesAdmin() {
  const { db } = useAdmin();
  const { pending, flash, run } = useTask();
  const { data: services, reload } = useLoad(async () => {
    const { data } = await db.from("services").select("*").order("sort_order");
    return (data as Service[]) ?? [];
  });

  const save = (e: FormEvent<HTMLFormElement>, id: string | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const title = text(fd, "title");
      if (!title) throw new Error("Title is required.");
      await saveRow(db, "services", id, { title, description: optional(fd, "description"), sort_order: int(fd, "sort_order") });
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Service saved" : "Service added", await refreshSite(db));
    });
  };

  const remove = (s: Service) => {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    run(async () => {
      await deleteRow(db, "services", s.id);
      reload();
      return savedMessage("Service deleted", await refreshSite(db));
    });
  };

  const fields = (s?: Service) => (
    <form onSubmit={(e) => save(e, s?.id ?? null)} className="grid gap-4 sm:grid-cols-[1fr_7rem]">
      <Field label="Title">
        <input name="title" required defaultValue={s?.title} className={inputClass} />
      </Field>
      <Field label="Order">
        <input name="sort_order" type="number" defaultValue={s?.sort_order ?? (services?.length ?? 0) + 1} className={inputClass} />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <textarea name="description" rows={2} defaultValue={s?.description ?? ""} className={inputClass} />
      </Field>
      <div>
        <Button variant={s ? "secondary" : "primary"} pending={pending}>
          {s ? "Save" : "Add service"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader title="Services" description="Shown in the “What we do” section and in the contact form dropdown." />
      <Flash ok={flash.ok} error={flash.error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add a service</h2>
        {fields()}
      </Card>

      {!services ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <Card key={`${s.id}-${s.title}-${s.sort_order}-${s.description}`}>
              {fields(s)}
              <div className="mt-3">
                <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove(s)}>
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
