"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { mediaUrl } from "@/lib/utils";

/**
 * Horizontal, swipeable rail of a project's creatives (posts / carousel slides).
 * Click any slide to open it full screen; arrows, keyboard and swipe move between them.
 */
export function SlideRail({ images, title }: { images: string[]; title: string }) {
  const rail = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20) * 2, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-3 px-5 md:px-8">
        <div className="mr-auto h-[3px] w-40 overflow-hidden rounded-full bg-ink/10 md:w-64" aria-hidden="true">
          <div className="h-full origin-left rounded-full bg-maroon transition-transform duration-200" style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
        </div>
        <RailButton label="Previous" onClick={() => scrollBy(-1)} dir={-1} />
        <RailButton label="Next" onClick={() => scrollBy(1)} dir={1} />
      </div>

      <ul
        ref={rail}
        onScroll={onScroll}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <li key={src} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23vw] xl:w-[300px]">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-2 shadow-lg shadow-ink/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-maroon"
              aria-label={`Open ${title} creative ${i + 1} of ${images.length}`}
            >
              <Image
                src={mediaUrl(src)}
                alt={`${title} — creative ${i + 1}`}
                fill
                sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 72vw"
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] tracking-wider text-cream backdrop-blur">
                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-cream/90 text-maroon opacity-0 transition group-hover:opacity-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </li>
        ))}
        <li aria-hidden="true" className="w-1 shrink-0" />
      </ul>

      {open !== null && <Lightbox images={images} title={title} start={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function RailButton({ label, onClick, dir }: { label: string; onClick: () => void; dir: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-12 items-center justify-center rounded-full border border-ink/15 bg-white/60 text-ink transition hover:border-maroon hover:bg-maroon hover:text-cream"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={dir === -1 ? "size-5 rotate-180" : "size-5"} aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Lightbox({ images, title, start, onClose }: { images: string[]; title: string; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => setIndex((i) => (i + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [go, onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — creative ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="relative h-[82vh] w-full max-w-[min(90vw,66vh)]" onClick={(e) => e.stopPropagation()}>
        <Image key={images[index]} src={mediaUrl(images[index])} alt={`${title} — creative ${index + 1}`} fill sizes="90vw" className="object-contain" />
      </div>

      <p className="absolute top-5 left-5 font-mono text-xs tracking-wider text-cream/70">
        {title} · {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 flex size-12 items-center justify-center rounded-full text-cream transition hover:bg-cream/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => (e.stopPropagation(), go(-1))}
            aria-label="Previous"
            className="absolute left-3 hidden size-12 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 rotate-180" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => (e.stopPropagation(), go(1))}
            aria-label="Next"
            className="absolute right-3 hidden size-12 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
