"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Kind = "success" | "error" | "info";
type Toast = { id: number; kind: Kind; message: string };
type ToastApi = { success: (m: string) => void; error: (m: string) => void; info: (m: string) => void };

const Ctx = createContext<ToastApi | null>(null);

/** Toast notifications for the admin: success / info close by themselves, errors stay longer. */
export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const DURATION: Record<Kind, number> = { success: 4000, info: 4000, error: 8000 };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((kind: Kind, message: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-3), { id, kind, message }]); // keep at most 4 on screen
  }, []);

  const [api] = useState<ToastApi>(() => ({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  }));

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState(false);

  // slide in, then close after a while (paused while hovered)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    if (hover) return;
    const id = setTimeout(onDismiss, DURATION[toast.kind]);
    return () => clearTimeout(id);
  }, [hover, onDismiss, toast.kind]);

  const styles = {
    success: { ring: "ring-emerald-200", icon: "bg-emerald-500", bar: "bg-emerald-500" },
    error: { ring: "ring-red-200", icon: "bg-red-500", bar: "bg-red-500" },
    info: { ring: "ring-zinc-200", icon: "bg-[#6a1a23]", bar: "bg-[#6a1a23]" },
  }[toast.kind];

  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl bg-white py-3.5 pr-3 pl-4 text-sm text-zinc-800 shadow-lg ring-1 transition-all duration-300 ease-out",
        styles.ring,
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white", styles.icon)} aria-hidden="true">
        {toast.kind === "success" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="size-3">
            <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : toast.kind === "error" ? (
          <span className="text-xs leading-none font-bold">!</span>
        ) : (
          <span className="text-xs leading-none font-bold">i</span>
        )}
      </span>
      <p className="flex-1 leading-snug font-medium">{toast.message}</p>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-my-1 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
      {/* time left */}
      <span
        aria-hidden="true"
        className={cn("absolute bottom-0 left-0 h-0.5 w-full origin-left", styles.bar, !hover && "animate-[toast-timer_linear_forwards]")}
        style={{ animationDuration: `${DURATION[toast.kind]}ms`, ...(hover ? { transform: "scaleX(1)" } : {}) }}
      />
    </div>
  );
}
