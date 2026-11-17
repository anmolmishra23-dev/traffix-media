import { SubmitButton } from "@/components/admin/buttons";
import { Card, Checkbox, Field, Flash, PageHeader, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Testimonial } from "@/lib/types";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdmin({ searchParams }: PageProps<"/admin/testimonials">) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const testimonials = (data as Testimonial[]) ?? [];

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client reviews. The section appears on the home page as soon as one is published."
      />
      <Flash ok={ok} error={error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add a testimonial</h2>
        <TestimonialFields nextOrder={testimonials.length + 1} />
      </Card>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <TestimonialFields testimonial={t} />
            <form action={deleteTestimonial} className="mt-3">
              <input type="hidden" name="id" value={t.id} />
              <SubmitButton variant="danger" pendingText="…" confirm={`Delete testimonial from ${t.name}?`}>
                Delete
              </SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}

function TestimonialFields({ testimonial: t, nextOrder }: { testimonial?: Testimonial; nextOrder?: number }) {
  return (
    <form action={saveTestimonial} className="grid gap-4 sm:grid-cols-3">
      {t && <input type="hidden" name="id" value={t.id} />}
      <Field label="Name *">
        <input name="name" required defaultValue={t?.name} className={inputClass} />
      </Field>
      <Field label="Role">
        <input name="role" defaultValue={t?.role ?? ""} className={inputClass} placeholder="Marketing Head" />
      </Field>
      <Field label="Company">
        <input name="company" defaultValue={t?.company ?? ""} className={inputClass} />
      </Field>
      <Field label="Quote *" className="sm:col-span-3">
        <textarea name="quote" required rows={3} defaultValue={t?.quote} className={inputClass} />
      </Field>
      <div className="flex flex-wrap items-center gap-6 sm:col-span-3">
        <Checkbox name="published" label="Show on website" defaultChecked={t?.published ?? true} />
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          Order
          <input name="sort_order" type="number" defaultValue={t?.sort_order ?? nextOrder} className={`${inputClass} w-20`} />
        </label>
        <SubmitButton variant={t ? "secondary" : "primary"}>{t ? "Save" : "Add testimonial"}</SubmitButton>
      </div>
    </form>
  );
}
