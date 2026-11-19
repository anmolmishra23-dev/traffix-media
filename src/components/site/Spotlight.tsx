"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A soft coloured light that follows the mouse across its parent section and shifts colour
 * (maroon → rose → amber, never green or blue) as it moves. Without a mouse (phones) it drifts on its own.
 * The parent must be `relative`.
 */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
        const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
        el.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
        el.style.setProperty("--spot-h", (340 + x * 55 + y * 10).toFixed(0)); // stays in the rose → amber range
        el.dataset.live = "true";
      });
    };
    host.addEventListener("pointermove", move);
    return () => {
      host.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className={cn("spotlight pointer-events-none absolute inset-0", className)} />;
}
