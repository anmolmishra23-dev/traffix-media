"use client";

import type { FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useLoad, useTask } from "@/components/admin/hooks";
import { Button, Card, Field, Loading, PageHeader, inputClass } from "@/components/admin/ui";
import { optional, refreshSite, savedMessage } from "@/lib/admin-api";
import type { SiteSettings } from "@/lib/types";

const FIELDS = [
  "tagline",
  "hero_heading",
  "hero_subheading",
  "email",
  "phone",
  "instagram",
  "whatsapp",
  "location",
  "stat_brands",
  "stat_industries",
] as const;

export default function SettingsAdmin() {
  const { db } = useAdmin();
  const { pending, run } = useTask();
  const { data: s, reload } = useLoad(async () => {
    const { data } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
    return (data ?? {}) as Partial<SiteSettings>;
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    run(async () => {
      const row: Record<string, string | null> = Object.fromEntries(FIELDS.map((f) => [f, optional(fd, f)]));
      if (row.instagram) row.instagram = row.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
      if (row.whatsapp) row.whatsapp = row.whatsapp.replace(/\D/g, "");
      const { error } = await db.from("site_settings").update(row).eq("id", 1);
      if (error) throw new Error(error.message);
      reload();
      return savedMessage("Settings saved", await refreshSite(db));
    });
  };

  return (
    <>
      <PageHeader title="Site settings" description="Headlines, about text and contact details used across the website." />

      {!s ? (
        <Loading />
      ) : (
        <form key={JSON.stringify(s)} onSubmit={onSubmit} className="space-y-6">
          <Card className="space-y-5">
            <h2 className="font-semibold">Home page</h2>
            <Field label="Main headline" hint="Each sentence goes on its own line. The last one is shown in maroon.">
              <input name="hero_heading" defaultValue={s.hero_heading ?? ""} className={inputClass} />
            </Field>
            <Field label="Intro text">
              <textarea name="hero_subheading" rows={3} defaultValue={s.hero_subheading ?? ""} className={inputClass} />
            </Field>
            <Field label="Tagline" hint="Shown in the footer.">
              <input name="tagline" defaultValue={s.tagline ?? ""} className={inputClass} />
            </Field>
          </Card>

          <Card className="space-y-5">
            <h2 className="font-semibold">Numbers shown on the site</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Brands worked with" hint='e.g. "50+"'>
                <input name="stat_brands" defaultValue={s.stat_brands ?? ""} className={inputClass} placeholder="50+" />
              </Field>
              <Field label="Industries" hint='e.g. "10+"'>
                <input name="stat_industries" defaultValue={s.stat_industries ?? ""} className={inputClass} placeholder="10+" />
              </Field>
            </div>
          </Card>

          <Card className="space-y-5">
            <h2 className="font-semibold">Contact details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email">
                <input name="email" type="email" defaultValue={s.email ?? ""} className={inputClass} />
              </Field>
              <Field label="Phone (as displayed)">
                <input name="phone" defaultValue={s.phone ?? ""} className={inputClass} placeholder="+91 82878 18962" />
              </Field>
              <Field label="WhatsApp number" hint="With country code, e.g. 918287818962">
                <input name="whatsapp" defaultValue={s.whatsapp ?? ""} className={inputClass} />
              </Field>
              <Field label="Instagram handle" hint="Without the @">
                <input name="instagram" defaultValue={s.instagram ?? ""} className={inputClass} />
              </Field>
              <Field label="Location / address (optional)" className="sm:col-span-2">
                <input name="location" defaultValue={s.location ?? ""} className={inputClass} placeholder="e.g. New Delhi, India" />
              </Field>
            </div>
          </Card>

          <Button pending={pending}>Save settings</Button>
        </form>
      )}
    </>
  );
}
