import { SubmitButton } from "@/components/admin/buttons";
import { Card, Field, Flash, PageHeader, inputClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";
import { deleteCategory, saveCategory } from "@/app/admin/actions";

export const metadata = { title: "Industries" };

export default async function CategoriesAdmin({ searchParams }: PageProps<"/admin/categories">) {
  const { ok, error } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data }, { data: projects }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("projects").select("category_id"),
  ]);
  const categories = (data as Category[]) ?? [];
  const usage = (id: string) => (projects ?? []).filter((p) => p.category_id === id).length;

  return (
    <>
      <PageHeader title="Industries" description="Used to group projects on the Work page and the home page." />
      <Flash ok={ok} error={error} />

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold">Add an industry</h2>
        <form action={saveCategory} className="grid gap-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
          <Field label="Name">
            <input name="name" required className={inputClass} placeholder="e.g. Hospitality" />
          </Field>
          <Field label="Order">
            <input name="sort_order" type="number" defaultValue={categories.length + 1} className={inputClass} />
          </Field>
          <SubmitButton pendingText="Adding…">Add</SubmitButton>
        </form>
      </Card>

      <div className="space-y-3">
        {categories.map((c) => (
          <Card key={c.id} className="p-4 md:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <form action={saveCategory} className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end">
                <input type="hidden" name="id" value={c.id} />
                <Field label="Name">
                  <input name="name" required defaultValue={c.name} className={inputClass} />
                </Field>
                <Field label="Slug">
                  <input name="slug" defaultValue={c.slug} className={inputClass} />
                </Field>
                <Field label="Order">
                  <input name="sort_order" type="number" defaultValue={c.sort_order} className={inputClass} />
                </Field>
                <SubmitButton variant="secondary">Save</SubmitButton>
              </form>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <SubmitButton
                  variant="danger"
                  pendingText="…"
                  confirm={`Delete "${c.name}"?${usage(c.id) ? ` ${usage(c.id)} project(s) will become uncategorised.` : ""}`}
                >
                  Delete
                </SubmitButton>
              </form>
            </div>
            <p className="mt-2 text-xs text-zinc-500">{usage(c.id)} project(s)</p>
          </Card>
        ))}
      </div>
    </>
  );
}
