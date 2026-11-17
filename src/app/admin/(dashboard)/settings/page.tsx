import { SubmitButton } from "@/components/admin/buttons";
import { Card, Field, Flash, PageHeader, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "@/app/admin/actions";

export const metadata = { title: "Site settings" };

export default async function SettingsAdmin({ searchParams }: PageProps<"/admin/settings">) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = (data ?? {}) as Partial<SiteSettings>;

  return (
    <>
      <PageHeader title="Site settings" description="Headlines, about text and contact details used across the website." />
      <Flash ok={ok} error={error} />

      <form action={saveSettings} className="space-y-6">
        <Card className="space-y-5">
          <h2 className="font-semibold">Home page</h2>
          <Field label="Main headline" hint="Each sentence goes on its own line. The first one is shown in maroon.">
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
          <h2 className="font-semibold">About page</h2>
          <Field label="Headline">
            <input name="about_heading" defaultValue={s.about_heading ?? ""} className={inputClass} />
          </Field>
          <Field label="About text" hint="Leave a blank line between paragraphs.">
            <textarea name="about_body" rows={7} defaultValue={s.about_body ?? ""} className={inputClass} />
          </Field>
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

        <SubmitButton>Save settings</SubmitButton>
      </form>
    </>
  );
}
