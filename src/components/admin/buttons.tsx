"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingText = "Saving…",
  variant = "primary",
  className,
  confirm,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-[#6a1a23] text-white hover:bg-[#4f121a]",
    secondary: "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  };
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
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
