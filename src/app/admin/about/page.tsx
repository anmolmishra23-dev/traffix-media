"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Field, Flash, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { deleteRow, int, optional, refreshSite, saveRow, savedMessage, text } from "@/lib/admin-api";
import type { AboutSection, Highlight, SiteSettings } from "@/lib/types";

const INTRO_FIELDS = ["about_heading", "about_body", "about_closing", "highlights_heading", "highlights_intro"] as const;

export default function AboutAdmin() {
  const { db } = useAdmin();
  const { pending, flash, run } = useTask();
  const { data, reload } = useLoad(async () => {
    const [s, sec, hl] = await Promise.all([
      db.from("site_settings").select(INTRO_FIELDS.join(",")).eq("id", 1).maybeSingle(),
      db.from("about_sections").select("*").order("sort_order"),
      db.from("highlights").select("*").order("sort_order"),
    ]);
    return {
      settings: (s.data ?? {}) as Partial<SiteSettings>,
      sections: (sec.data as AboutSection[]) ?? [],
      highlights: (hl.data as Highlight[]) ?? [],
    };
  });

  const saveIntro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(async () => {
      const row = Object.fromEntries(INTRO_FIELDS.map((f) => [f, optional(fd, f)]));
      const { error } = await db.from("site_settings").update(row).eq("id", 1);
      if (error) throw new Error(error.message);
      reload();
      return savedMessage("About page saved", await refreshSite(db));
    });
  };

  const saveSection = (e: FormEvent<HTMLFormElement>, id: string | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const title = text(fd, "title");
      if (!title) throw new Error("Section title is required.");
      await saveRow(db, "about_sections", id, { title, body: optional(fd, "body"), sort_order: int(fd, "sort_order") });
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Section saved" : "Section added", await refreshSite(db));
    });
  };

  const saveHighlight = (e: FormEvent<HTMLFormElement>, id: string | null) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      const value = text(fd, "value");
      const label = text(fd, "label");
      if (!value || !label) throw new Error("Figure and label are required.");
      await saveRow(db, "highlights", id, { value, label, description: optional(fd, "description"), sort_order: int(fd, "sort_order") });
      if (!id) form.reset();
      reload();
      return savedMessage(id ? "Highlight saved" : "Highlight added", await refreshSite(db));
    });
  };

  const remove = (table: "about_sections" | "highlights", id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    run(async () => {
      await deleteRow(db, table, id);
      reload();
      return savedMessage("Deleted", await refreshSite(db));
    });
  };

  if (!data) return <Loading />;
  const { settings: s, sections, highlights } = data;

  const sectionFields = (sec?: AboutSection) => (
    <form onSubmit={(e) => saveSection(e, sec?.id ?? null)} className="grid gap-4 sm:grid-cols-[1fr_7rem]">
      <Field label="Title">
        <input name="title" required defaultValue={sec?.title} className={inputClass} placeholder="What we do differently" />
      </Field>
      <Field label="Order">
        <input name="sort_order" type="number" defaultValue={sec?.sort_order ?? sections.length + 1} className={inputClass} />
      </Field>
      <Field label="Text" hint="Blank line between paragraphs. The first paragraph is shown large." className="sm:col-span-2">
        <textarea name="body" rows={6} defaultValue={sec?.body ?? ""} className={inputClass} />
      </Field>
      <div>
        <Button variant={sec ? "secondary" : "primary"} pending={pending}>
          {sec ? "Save section" : "Add section"}
        </Button>
      </div>
    </form>
  );

  const highlightFields = (h?: Highlight) => (
    <form onSubmit={(e) => saveHighlight(e, h?.id ?? null)} className="grid gap-4 sm:grid-cols-[9rem_1fr_6rem]">
      <Field label="Figure">
        <input name="value" required defaultValue={h?.value} className={inputClass} placeholder="95%+" />
      </Field>
      <Field label="Label">
        <input name="label" required defaultValue={h?.label} className={inputClass} placeholder="Client satisfaction rate" />
      </Field>
      <Field label="Order">
        <input name="sort_order" type="number" defaultValue={h?.sort_order ?? highlights.length + 1} className={inputClass} />
      </Field>
      <Field label="Description" className="sm:col-span-3">
        <input name="description" defaultValue={h?.description ?? ""} className={inputClass} />
      </Field>
      <div>
        <Button variant={h ? "secondary" : "primary"} pending={pending}>
          {h ? "Save" : "Add highlight"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader title="About page" description="Everything shown on the About page. The team is managed under Team." />
      <Flash ok={flash.ok} error={flash.error} />

      <form key={JSON.stringify(s)} onSubmit={saveIntro} className="space-y-6">
        <Card className="space-y-5">
          <h2 className="font-semibold">Intro</h2>
          <Field label="Headline">
            <input name="about_heading" defaultValue={s.about_heading ?? ""} className={inputClass} />
          </Field>
          <Field label="Intro text" hint="Blank line between paragraphs. The first paragraph appears next to the headline.">
            <textarea name="about_body" rows={9} defaultValue={s.about_body ?? ""} className={inputClass} />
          </Field>
          <Field label="Closing line" hint="Shown large at the end of the page. Each sentence on its own line.">
            <input name="about_closing" defaultValue={s.about_closing ?? ""} className={inputClass} />
          </Field>
        </Card>
        <Card className="space-y-5">
          <h2 className="font-semibold">Highlights section</h2>
          <Field label="Heading">
            <input name="highlights_heading" defaultValue={s.highlights_heading ?? ""} className={inputClass} placeholder="The work speaks" />
          </Field>
          <Field label="Intro">
            <textarea name="highlights_intro" rows={2} defaultValue={s.highlights_intro ?? ""} className={inputClass} />
          </Field>
        </Card>
        <Button pending={pending}>Save intro &amp; headings</Button>
      </form>

      <h2 className="mt-12 mb-1 text-lg font-bold">Story sections</h2>
      <p className="mb-4 text-sm text-zinc-500">Shown in order. The last section is displayed as the vision statement over video.</p>
      <div className="space-y-3">
        {sections.map((sec) => (
          <Card key={`${sec.id}-${sec.title}-${sec.sort_order}-${sec.body?.length}`}>
            {sectionFields(sec)}
            <div className="mt-3">
              <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove("about_sections", sec.id, sec.title)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        <Card>
          <h3 className="mb-4 font-semibold">Add a section</h3>
          {sectionFields()}
        </Card>
      </div>

      <h2 className="mt-12 mb-1 text-lg font-bold">Highlights</h2>
      <p className="mb-4 text-sm text-zinc-500">The big figures in “The work speaks”.</p>
      <div className="space-y-3">
        {highlights.map((h) => (
          <Card key={`${h.id}-${h.value}-${h.label}-${h.sort_order}-${h.description}`}>
            {highlightFields(h)}
            <div className="mt-3">
              <Button type="button" variant="danger" pending={pending} pendingText="…" onClick={() => remove("highlights", h.id, h.label)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        <Card>
          <h3 className="mb-4 font-semibold">Add a highlight</h3>
          {highlightFields()}
        </Card>
      </div>
    </>
  );
}
