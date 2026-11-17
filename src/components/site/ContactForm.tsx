"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitEnquiry, type ContactState } from "@/lib/enquiry";
import { ArrowUpRight, HeartBubble } from "@/components/icons";
import { cn } from "@/lib/utils";

const budgets = ["Under ₹25,000", "₹25,000 – ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000+", "Not sure yet"];

const field =
  "w-full rounded-xl border border-line bg-white/60 px-4 py-3.5 text-ink placeholder:text-muted/60 transition outline-none focus:border-maroon focus:bg-white focus:ring-4 focus:ring-maroon/10";

export function ContactForm({ services }: { services: string[] }) {
  const [state, setState] = useState<ContactState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  // Saves straight to Supabase from the browser, so it works on static hosting (GitHub Pages) too.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => setState(await submitEnquiry(formData)));
  };

  if (state.status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-3xl bg-maroon p-10 text-cream">
        <HeartBubble className="size-14 text-cream" />
        <h2 className="font-display mt-6 text-4xl font-black tracking-tight uppercase">Thank you!</h2>
        <p className="mt-3 max-w-md text-cream/80">
          Your message is with us. We&apos;ll get back to you within one working day.
        </p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Field label="Your name *" error={err.name}>
        <input name="name" required autoComplete="name" className={cn(field, err.name && "border-maroon")} placeholder="Full name" />
      </Field>
      <Field label="Email *" error={err.email}>
        <input name="email" type="email" required autoComplete="email" className={cn(field, err.email && "border-maroon")} placeholder="you@company.com" />
      </Field>
      <Field label="Phone">
        <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="+91" />
      </Field>
      <Field label="Brand / company">
        <input name="company" autoComplete="organization" className={field} placeholder="Brand name" />
      </Field>
      <Field label="What do you need?">
        <select name="service" className={field} defaultValue="">
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>Something else</option>
        </select>
      </Field>
      <Field label="Monthly budget">
        <select name="budget" className={field} defaultValue="">
          <option value="">Select a range</option>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Tell us about your project *" error={err.message}>
          <textarea
            name="message"
            required
            rows={5}
            className={cn(field, "resize-y", err.message && "border-maroon")}
            placeholder="Your brand, your goals, timelines — anything that helps."
          />
        </Field>
      </div>

      {state.message && (
        <p className="rounded-xl bg-maroon/10 px-4 py-3 text-sm font-medium text-maroon sm:col-span-2" role="alert">
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 rounded-full bg-maroon px-8 py-4 font-semibold text-cream transition hover:bg-maroon-deep disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
          <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-maroon">{error}</span>}
    </label>
  );
}
