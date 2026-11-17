"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "../actions";
import { inputClass } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#6a1a23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4f121a] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
