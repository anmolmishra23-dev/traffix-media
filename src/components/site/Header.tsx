"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="relative z-50 shrink-0" aria-label="Traffix Media — home">
          <Image
            src={open ? "/brand/logo-nav-light.png" : "/brand/logo-nav.png"}
            alt="Traffix Media"
            width={583}
            height={210}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[15px] font-medium text-ink/80 transition-colors hover:text-maroon",
                pathname === l.href && "text-maroon",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-maroon-deep"
          >
            Let&apos;s talk
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={cn("absolute h-0.5 w-6 transition", open ? "rotate-45 bg-cream" : "-translate-y-1.5 bg-ink")} />
          <span className={cn("absolute h-0.5 w-6 transition", open ? "-rotate-45 bg-cream" : "translate-y-1.5 bg-ink")} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between bg-maroon px-6 pt-28 pb-10 text-cream transition-all duration-500 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "font-display text-5xl font-extrabold uppercase tracking-tight transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="font-display text-lg font-bold uppercase tracking-wide text-cream/70">Be seen. Be known.</p>
      </div>
    </header>
  );
}
