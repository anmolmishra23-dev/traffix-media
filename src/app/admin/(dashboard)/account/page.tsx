import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const { user } = await requireAdmin();

  return (
    <>
      <PageHeader title="My account" description="Your admin login details." />

      <Card className="mb-6">
        <p className="text-sm text-zinc-500">Signed in as</p>
        <p className="mt-1 font-semibold">{user.email}</p>
      </Card>

      <Card>
        <h2 className="mb-5 font-semibold">Change password</h2>
        <ChangePasswordForm />
      </Card>
    </>
  );
}
