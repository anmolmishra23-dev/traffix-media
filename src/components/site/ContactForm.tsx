"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitEnquiry, type ContactState } from "@/lib/enquiry";
import { ArrowUpRight } from "@/components/icons";
import { cn } from "@/lib/utils";

const budgets = ["Under ₹25K", "₹25K – ₹50K", "₹50K – ₹1L", "₹1L+", "Not sure yet"];

const field =
  "w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/30 transition outline-none focus:border-maroon focus:ring-0";

/**
 * The project brief, styled as a film slate. Saves straight to Supabase from the browser,
 * so it works on static hosting (GitHub Pages) too.
 */
export function ContactForm({ services }: { services: string[] }) {
  const [state, setState] = useState<ContactState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const [take, setTake] = useState(1);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await submitEnquiry(formData);
      if (result.status === "error") setTake((t) => t + 1);
      setState(result);
    });
  };

  if (state.status === "success") {
    return (
      <div className="overflow-hidden rounded-[2rem] bg-ink text-cream shadow-2xl shadow-ink/20" role="status">
        <Clapper closed />
        <div className="flex min-h-[420px] flex-col items-start justify-center p-8 md:p-12">
          <p className="font-mono text-xs tracking-[0.2em] text-[#f0b9bf] uppercase">Brief received</p>
          <h2 className="font-display mt-4 text-5xl font-black tracking-tight uppercase md:text-6xl">That&apos;s a wrap!</h2>
          <p className="mt-4 max-w-md text-lg text-cream/75">
            Thanks for telling us about your brand. We&apos;ll get back to you within one working day.
          </p>
        </div>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} noValidate className="overflow-hidden rounded-[2rem] bg-cream shadow-2xl shadow-ink/15 ring-1 ring-ink/5">
      <Clapper take={take} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="space-y-8 p-7 md:p-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <Line label="Your name *" error={err.name}>
            <input name="name" required autoComplete="name" className={cn(field, err.name && "border-maroon")} placeholder="Full name" />
          </Line>
          <Line label="Email *" error={err.email}>
            <input name="email" type="email" required autoComplete="email" className={cn(field, err.email && "border-maroon")} placeholder="you@brand.com" />
          </Line>
          <Line label="Phone / WhatsApp">
            <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="+91" />
          </Line>
          <Line label="Brand / company">
            <input name="company" autoComplete="organization" className={field} placeholder="Your brand" />
          </Line>
        </div>

        <fieldset>
          <legend className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">What do you need? (pick any)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...services, "Something else"].map((s) => (
              <Chip key={s} type="checkbox" name="service" value={s} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Budget</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {budgets.map((b) => (
              <Chip key={b} type="radio" name="budget" value={b} />
            ))}
          </div>
        </fieldset>

        <Line label="Tell us about your project *" error={err.message}>
          <textarea
            name="message"
            required
            rows={4}
            className={cn(field, "resize-y", err.message && "border-maroon")}
            placeholder="Your brand, what you want to make, timelines — anything that helps."
          />
        </Line>

        {state.message && (
          <p className="rounded-xl bg-maroon/10 px-4 py-3 text-sm font-medium text-maroon" role="alert">
            {state.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-sm text-muted">We reply within one working day.</p>
          <button
            type="submit"
            disabled={pending}
            className="group inline-flex items-center gap-3 rounded-full bg-maroon px-8 py-4 font-semibold text-cream transition hover:bg-maroon-deep disabled:opacity-60"
          >
            {pending ? "Rolling…" : "Send brief — action!"}
            <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
          </button>
        </div>
      </div>
    </form>
  );
}

/** Clapperboard header. The top stick is open while filling in, and snaps shut on success. */
function Clapper({ take = 1, closed = false }: { take?: number; closed?: boolean }) {
  const stripes = "repeating-linear-gradient(-45deg, var(--color-ink) 0 22px, var(--color-cream) 22px 44px)";
  return (
    <div aria-hidden="true" className="bg-ink pt-3">
      <div className="relative h-7">
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-7 origin-bottom-left transition-transform duration-500",
            closed ? "rotate-0" : "-rotate-[3deg]",
          )}
          style={{ background: stripes }}
        />
      </div>
      <div className="h-6 border-t-2 border-ink" style={{ background: stripes, backgroundPosition: "22px 0" }} />
      <div className="grid grid-cols-3 divide-x divide-cream/15 font-mono text-[10px] tracking-[0.14em] text-cream/80 uppercase sm:text-[11px]">
        <span className="truncate px-4 py-3 sm:px-5">Prod · Traffix</span>
        <span className="px-4 py-3 sm:px-5">Scene 01</span>
        <span className="px-4 py-3 sm:px-5">Take {String(take).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function Chip({ type, name, value }: { type: "checkbox" | "radio"; name: string; value: string }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-flex items-center rounded-full border border-ink/15 bg-white/60 px-4 py-2 text-sm font-medium text-ink/75 transition select-none hover:border-maroon hover:text-maroon peer-checked:border-maroon peer-checked:bg-maroon peer-checked:text-cream peer-checked:hover:text-cream peer-focus-visible:ring-4 peer-focus-visible:ring-maroon/20">
        {value}
      </span>
    </label>
  );
}

function Line({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-maroon">{error}</span>}
    </label>
  );
}
