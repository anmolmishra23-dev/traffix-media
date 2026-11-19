"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { MediaList } from "@/components/admin/MediaList";
import { Button, Card, Field, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { applyMediaList, deleteImages, deleteRow, int, optional, refreshSite, saveRow, savedMessage, text } from "@/lib/admin-api";
import type { Service } from "@/lib/types";

export default function ServicesAdmin() {
  const { db } = useAdmin();
  const { pending, run } = useTask();
  const { data: services, reload } = useLoad(async () => {
    const { data } = await db.from("services").select("*").order("sort_order");
    return (data as Service[]) ?? [];
  });

  const save = (e: FormEvent<HTMLFormElement>, service: Service | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const id = service?.id ?? null;
    run(async () => {
      const title = text(fd, "title");
      if (!title) throw new Error("Title is required.");
      const { list: media, removed } = await applyMediaList(db, fd, "media", service?.media ?? [], "services", { images: true });
      await saveRow(db, "services", id, { title, description: optional(fd, "description"), media, sort_order: int(fd, "sort_order") });
      await deleteImages(db, removed);
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Service saved" : "Service added", await refreshSite(db));
    });
  };

  const remove = (s: Service) => {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    run(async () => {
      await deleteRow(db, "services", s.id);
      await deleteImages(db, s.media ?? []);
      reload();
      return savedMessage("Service deleted", await refreshSite(db));
    });
  };

  const fields = (s?: Service) => (
    <form onSubmit={(e) => save(e, s ?? null)} className="grid gap-4 sm:grid-cols-[1fr_7rem]">
      <Field label="Title">
        <input name="title" required defaultValue={s?.title} className={inputClass} />
      </Field>
      <Field label="Order">
        <input name="sort_order" type="number" defaultValue={s?.sort_order ?? (services?.length ?? 0) + 1} className={inputClass} />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <textarea name="description" rows={2} defaultValue={s?.description ?? ""} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <MediaList
          name="media"
          items={s?.media ?? []}
          images
          label="Hover photos & videos"
          hint="They play behind this service when someone hovers over it (and while it's on screen on phones). Photos become WebP; videos must be MP4/WebM, 5 MB max."
        />
      </div>
      <div>
        <Button variant={s ? "secondary" : "primary"} pending={pending} pendingText="Saving & uploading…">
          {s ? "Save" : "Add service"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader title="Services" description="Shown in the “What we do” section and in the contact form dropdown." />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add a service</h2>
        {fields()}
      </Card>

      {!services ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <Card key={`${s.id}-${s.title}-${s.sort_order}-${s.description}-${(s.media ?? []).join()}`}>
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
