"use client";

import { useActionState, useState } from "react";
import { changePassword, type PasswordState } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/ui";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  const [show, setShow] = useState(false);
  const type = show ? "text" : "password";

  return (
    <form action={action} className="max-w-md space-y-4" key={state.ok ? "done" : "form"}>
      {state.ok && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Password changed. Use the new password next time you sign in.
        </p>
      )}
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </p>
      )}

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
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4f121a] disabled:opacity-60"
        >
          {pending ? "Changing…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
