"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, initials, mediaUrl } from "@/lib/utils";

export type SlideTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  logo: string | null;
  cover: string | null;
  slug: string | null;
};

const AUTOPLAY_MS = 9000;

/**
 * Sliding testimonials. All cards share one grid cell, so the section is as tall as the
 * longest quote and never jumps. Auto-advances, pauses on hover/focus, supports swipe + arrows.
 */
export function TestimonialSlider({ items }: { items: SlideTestimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar
  const touchX = useRef<number | null>(null);
  const n = items.length;

  const go = useCallback(
    (d: number) => {
      setIndex((i) => (i + d + n) % n);
      setTick((t) => t + 1);
    },
    [n],
  );

  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [paused, n, go, index, tick]);

  if (!n) return null;
  const current = items[index];

  return (
    <div
      className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* left rail: heading + client list + controls */}
      <div className="flex flex-col">
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/60 uppercase">
          <span className="size-2 rounded-full bg-[#f0b9bf]" /> Kind words
        </p>
        <h2 className="font-display mt-4 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
          What clients <span className="text-[#f0b9bf]">say</span>
        </h2>

        <ul className="mt-10 hidden space-y-1 lg:block" aria-label="Choose a testimonial">
          {items.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => (setIndex(i), setTick((x) => x + 1))}
                aria-current={i === index}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                  i === index ? "bg-cream/10" : "hover:bg-cream/5",
                )}
              >
                <Avatar t={t} small />
                <span className="min-w-0">
                  <span className={cn("block truncate text-sm font-semibold", i === index ? "text-cream" : "text-cream/60")}>{t.company ?? t.name}</span>
                  <span className="block truncate text-xs text-cream/45">{t.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-3 lg:mt-auto lg:pt-8">
          <Arrow label="Previous testimonial" onClick={() => go(-1)} dir={-1} />
          <Arrow label="Next testimonial" onClick={() => go(1)} dir={1} />
          <div className="ml-3 flex gap-1.5 lg:hidden" aria-hidden="true">
            {items.map((t, i) => (
              <span key={t.id} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-cream" : "w-1.5 bg-cream/30")} />
            ))}
          </div>
        </div>
      </div>

      {/* stage */}
      <div
        className="relative"
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {/* cards peeking behind */}
        <div aria-hidden="true" className="absolute inset-x-6 -bottom-3 top-6 rounded-[2rem] bg-cream/10 md:inset-x-10 md:-bottom-6" />
        <div aria-hidden="true" className="absolute inset-x-3 -bottom-1.5 top-3 rounded-[2rem] bg-cream/20 md:inset-x-5 md:-bottom-3" />

        <div className="relative grid">
          {items.map((t, i) => {
            const offset = (i - index + n) % n;
            const active = offset === 0;
            return (
              <figure
                key={t.id}
                aria-hidden={!active}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                className={cn(
                  "col-start-1 row-start-1 flex flex-col overflow-hidden rounded-[2rem] bg-cream text-ink shadow-2xl shadow-black/30 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                  active ? "translate-x-0 rotate-0 opacity-100" : offset === n - 1 ? "pointer-events-none -translate-x-16 -rotate-2 opacity-0" : "pointer-events-none translate-x-16 rotate-2 opacity-0",
                )}
              >
                <div className="flex flex-1 flex-col p-7 md:p-12">
                  <svg viewBox="0 0 48 36" className="h-9 w-12 text-maroon" aria-hidden="true">
                    <path fill="currentColor" d="M0 36V22C0 9.6 6.2 2.3 18.6 0l2 4.6C13.8 6.5 10.4 10.6 10.2 17H19v19H0Zm27 0V22C27 9.6 33.2 2.3 45.6 0l2 4.6C40.8 6.5 37.4 10.6 37.2 17H46v19H27Z" />
                  </svg>
                  <blockquote
                    className={cn(
                      "mt-6 flex-1 leading-relaxed text-ink/85 text-pretty whitespace-pre-line",
                      t.quote.length > 600 ? "text-base md:text-lg" : t.quote.length > 380 ? "text-lg md:text-xl" : "text-xl md:text-2xl",
                    )}
                  >
                    {t.quote.trim()}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                    <Avatar t={t} />
                    <div className="min-w-0">
                      <p className="font-display text-lg font-extrabold tracking-tight">{t.name}</p>
                      <p className="truncate text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                    </div>
                    {t.slug && (
                      <Link
                        href={`/work/${t.slug}`}
                        tabIndex={active ? 0 : -1}
                        className="ml-auto hidden shrink-0 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold transition hover:border-maroon hover:text-maroon sm:inline-flex"
                      >
                        See the work
                      </Link>
                    )}
                  </figcaption>
                </div>
                {/* progress */}
                <div className="h-1 bg-ink/5">
                  {active && (
                    <div
                      key={`${index}-${tick}-${paused}`}
                      className={cn("h-full origin-left bg-maroon", !paused && "animate-[progress_9s_linear_both]")}
                      style={paused ? { transform: "scaleX(0)" } : undefined}
                    />
                  )}
                </div>
              </figure>
            );
          })}
        </div>

        {/* the brand's work, floating beside the card */}
        {current.cover && (
          <Link
            href={current.slug ? `/work/${current.slug}` : "/work"}
            key={current.id}
            aria-label={`See ${current.company ?? current.name} work`}
            className="absolute -top-24 -right-3 z-10 hidden w-28 rotate-6 overflow-hidden rounded-2xl border-4 border-cream shadow-2xl transition hover:rotate-0 md:block lg:-right-8 lg:w-36 animate-[rise_0.7s_ease-out_both]"
          >
            <div className="relative aspect-[4/5]">
              <Image src={mediaUrl(current.cover)} alt="" fill sizes="144px" className="object-cover" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function Avatar({ t, small }: { t: SlideTestimonial; small?: boolean }) {
  const size = small ? "size-10 rounded-lg" : "size-14 rounded-2xl";
  if (t.logo)
    return (
      <span className={cn("flex shrink-0 items-center justify-center bg-ink p-2", size)}>
        <Image src={mediaUrl(t.logo)} alt="" width={64} height={64} className="max-h-full w-auto object-contain brightness-0 invert" />
      </span>
    );
  return (
    <span className={cn("font-display flex shrink-0 items-center justify-center bg-maroon font-black text-cream", size, small ? "text-xs" : "text-lg")}>
      {initials(t.company ?? t.name)}
    </span>
  );
}

function Arrow({ label, onClick, dir }: { label: string; onClick: () => void; dir: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-12 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-cream hover:bg-cream hover:text-maroon"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("size-5", dir === -1 && "rotate-180")} aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
