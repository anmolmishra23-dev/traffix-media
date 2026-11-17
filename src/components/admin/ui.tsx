import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#6a1a23] focus:ring-4 focus:ring-[#6a1a23]/10";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6", className)}>{children}</div>;
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[#6a1a23]" />
      {label}
    </label>
  );
}

export function Flash({ ok, error }: { ok?: string | string[]; error?: string | string[] }) {
  const message = (Array.isArray(error) ? error[0] : error) || (Array.isArray(ok) ? ok[0] : ok);
  if (!message) return null;
  const isError = Boolean(error);
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "mb-6 rounded-lg border px-4 py-3 text-sm font-medium",
        isError ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      {message}
    </div>
  );
}

export function Badge({ children, tone = "zinc" }: { children: React.ReactNode; tone?: "zinc" | "green" | "maroon" | "amber" }) {
  const tones = {
    zinc: "bg-zinc-100 text-zinc-700",
    green: "bg-emerald-50 text-emerald-700",
    maroon: "bg-[#6a1a23]/10 text-[#6a1a23]",
    amber: "bg-amber-50 text-amber-700",
  };
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Button({
  children,
  pending,
  pendingText = "Saving…",
  variant = "primary",
  type = "submit",
  onClick,
  className,
}: {
  children: React.ReactNode;
  pending?: boolean;
  pendingText?: string;
  variant?: "primary" | "secondary" | "danger";
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}) {
  const styles = {
    primary: "bg-[#6a1a23] text-white hover:bg-[#4f121a]",
    secondary: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  };
  return (
    <button
      type={type}
      disabled={pending}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60",
        styles[variant],
        className,
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-zinc-500">Loading…</p>;
}
