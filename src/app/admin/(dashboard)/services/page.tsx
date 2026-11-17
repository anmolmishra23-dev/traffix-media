import { SubmitButton } from "@/components/admin/buttons";
import { Card, Field, Flash, PageHeader, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Service } from "@/lib/types";
import { deleteService, saveService } from "@/app/admin/actions";

export const metadata = { title: "Services" };

export default async function ServicesAdmin({ searchParams }: PageProps<"/admin/services">) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  const services = (data as Service[]) ?? [];

  return (
    <>
      <PageHeader title="Services" description="Shown in the “What we do” section and in the contact form dropdown." />
      <Flash ok={ok} error={error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add a service</h2>
        <ServiceFields nextOrder={services.length + 1} />
      </Card>

      <div className="space-y-3">
        {services.map((s) => (
          <Card key={s.id}>
            <ServiceFields service={s} />
            <form action={deleteService} className="mt-3">
              <input type="hidden" name="id" value={s.id} />
              <SubmitButton variant="danger" pendingText="…" confirm={`Delete "${s.title}"?`}>
                Delete
              </SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}

function ServiceFields({ service, nextOrder }: { service?: Service; nextOrder?: number }) {
  return (
    <form action={saveService} className="grid gap-4 sm:grid-cols-[1fr_7rem]">
      {service && <input type="hidden" name="id" value={service.id} />}
      <Field label="Title">
        <input name="title" required defaultValue={service?.title} className={inputClass} />
      </Field>
      <Field label="Order">
        <input name="sort_order" type="number" defaultValue={service?.sort_order ?? nextOrder} className={inputClass} />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <textarea name="description" rows={2} defaultValue={service?.description ?? ""} className={inputClass} />
      </Field>
      <div>
        <SubmitButton variant={service ? "secondary" : "primary"}>{service ? "Save" : "Add service"}</SubmitButton>
      </div>
    </form>
  );
}
