"use client";

import { useState, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminApp";
import { useTask } from "@/components/admin/hooks";
import { Button, Card, Field, Flash, PageHeader, inputClass } from "@/components/admin/ui";
import { changePassword } from "@/lib/admin-api";

export default function AccountPage() {
  const { db, user } = useAdmin();
  const { pending, flash, run } = useTask();
  const [show, setShow] = useState(false);
  const type = show ? "text" : "password";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    run(async () => {
      await changePassword(db, user.email!, fd);
      form.reset();
      return "Password changed. Use the new password next time you sign in.";
    });
  };

  return (
    <>
      <PageHeader title="My account" description="Your admin login details." />

      <Card className="mb-6">
        <p className="text-sm text-zinc-500">Signed in as</p>
        <p className="mt-1 font-semibold">{user.email}</p>
      </Card>

      <Card>
        <h2 className="mb-5 font-semibold">Change password</h2>
        <form onSubmit={onSubmit} className="max-w-md space-y-4">
          <Flash ok={flash.ok} error={flash.error} />
          <Field label="Current password">
            <input name="current_password" type={type} autoComplete="current-password" required className={inputClass} />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <input name="new_password" type={type} autoComplete="new-password" minLength={8} required className={inputClass} />
          </Field>
          <Field label="Confirm new password">
            <input name="confirm_password" type={type} autoComplete="new-password" minLength={8} required className={inputClass} />
          </Field>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="size-4 accent-[#6a1a23]" />
            Show passwords
          </label>
          <div>
            <Button pending={pending} pendingText="Changing…">
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
