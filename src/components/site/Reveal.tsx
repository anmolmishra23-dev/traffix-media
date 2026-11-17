"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
};

export function Reveal({ children, as: Tag = "div", className = "", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already on screen: leave it alone (its CSS entrance animation handles it).
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("reveal-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
