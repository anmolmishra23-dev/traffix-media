"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Checkbox, Field, Flash, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { bool, deleteImages, deleteRow, int, optional, refreshSite, saveRow, savedMessage, text, uploadImage } from "@/lib/admin-api";
import type { TeamMember } from "@/lib/types";
import { initials, mediaUrl } from "@/lib/utils";

const fileInput =
  "block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium";

export default function TeamAdmin() {
  const { db } = useAdmin();
  const { pending, flash, run } = useTask();
  const { data: team, reload } = useLoad(async () => {
    const { data } = await db.from("team_members").select("*").order("sort_order");
    return (data as TeamMember[]) ?? [];
  });

  const save = (e: FormEvent<HTMLFormElement>, member: TeamMember | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const name = text(fd, "name");
      if (!name) throw new Error("Name is required.");
      let photo = member?.photo_url ?? null;
      const removed: (string | null)[] = [];
      if (bool(fd, "remove_photo") && photo) {
        removed.push(photo);
        photo = null;
      }
      const file = fd.get("photo");
      if (file instanceof File && file.size > 0) {
        if (photo) removed.push(photo);
        photo = await uploadImage(db, file, "team");
      }
      await saveRow(db, "team_members", member?.id ?? null, {
        name,
        role: optional(fd, "role"),
        photo_url: photo,
        published: bool(fd, "published"),
        sort_order: int(fd, "sort_order"),
      });
      await deleteImages(db, removed);
      if (!member) form.reset();
      reload();
      return savedMessage(member ? "Team member saved" : "Team member added", await refreshSite(db));
    });
  };

  const remove = (m: TeamMember) => {
    if (!window.confirm(`Remove ${m.name} from the team?`)) return;
    run(async () => {
      await deleteRow(db, "team_members", m.id);
      await deleteImages(db, [m.photo_url]);
      reload();
      return savedMessage("Team member removed", await refreshSite(db));
    });
  };

  const fields = (m?: TeamMember) => (
    <form onSubmit={(e) => save(e, m ?? null)} className="grid gap-5 sm:grid-cols-[8rem_1fr]">
      <div className="relative aspect-[4/5] w-32 overflow-hidden rounded-xl bg-zinc-100">
        {m?.photo_url ? (
          <Image src={mediaUrl(m.photo_url)} alt="" fill sizes="128px" unoptimized className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-zinc-400">{m ? initials(m.name) : "+"}</span>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input name="name" required defaultValue={m?.name} className={inputClass} />
        </Field>
        <Field label="Role">
          <input name="role" defaultValue={m?.role ?? ""} className={inputClass} placeholder="Content Head & Co-founder" />
        </Field>
        <Field label={m?.photo_url ? "Replace photo" : "Photo"} hint="Portrait photo works best. Converted to WebP automatically." className="sm:col-span-2">
          <input name="photo" type="file" accept="image/*" className={fileInput} />
        </Field>
        <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
          <Checkbox name="published" label="Show on website" defaultChecked={m?.published ?? true} />
          {m?.photo_url && <Checkbox name="remove_photo" label="Remove photo" />}
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            Order
            <input name="sort_order" type="number" defaultValue={m?.sort_order ?? (team?.length ?? 0) + 1} className={`${inputClass} w-20`} />
          </label>
          <Button variant={m ? "secondary" : "primary"} pending={pending} pendingText="Saving & uploading…">
            {m ? "Save" : "Add member"}
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader title="Team" description="The people shown on the About page." />
      <Flash ok={flash.ok} error={flash.error} />
      {!team ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {team.map((m) => (
            <Card key={`${m.id}-${m.name}-${m.role}-${m.photo_url}-${m.sort_order}-${m.published}`}>
              {fields(m)}
              <div className="mt-3">
                <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove(m)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
          <Card>
            <h2 className="mb-4 font-semibold">Add a team member</h2>
            {fields()}
          </Card>
        </div>
      )}
    </>
  );
}
