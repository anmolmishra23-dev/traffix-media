"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn, isVideo, mediaUrl, posterFor } from "@/lib/utils";

const STEP_MS = 2600;

// true on phones/tablets (no hover) — there the media plays while the tile is in the middle of the screen
const noHover = {
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia("(hover: none)");
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
  get: () => window.matchMedia("(hover: none)").matches,
  server: () => false,
};

function TileVideo({ src, playing }: { src: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <video
      ref={ref}
      src={mediaUrl(src)}
      poster={posterFor(src) ? mediaUrl(posterFor(src)!) : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="h-full w-full object-cover"
    />
  );
}

/**
 * "What we do" tile. Hovering (or, on phones, scrolling it to the middle of the screen) turns it maroon and
 * plays the service's photos/videos behind the text, one after another (Admin → Services → hover media).
 */
export function ServiceTile({
  index,
  title,
  description,
  media,
}: {
  index: number;
  title: string;
  description: string | null;
  media: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useSyncExternalStore(noHover.subscribe, noHover.get, noHover.server);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false); // media is only loaded after the first activation
  const [step, setStep] = useState(0);
  const active = hover || (touch && inView);

  useEffect(() => {
    const el = ref.current;
    if (!el || !touch) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setArmed(true);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [touch]);

  useEffect(() => {
    if (!active || media.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setStep((s) => (s + 1) % media.length), STEP_MS);
    return () => clearInterval(t);
  }, [active, media.length]);

  const current = media.length ? step % media.length : -1;

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setHover(true);
        setArmed(true);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      className={cn(
        "relative isolate h-full min-h-64 overflow-hidden p-8 transition-colors duration-500 md:min-h-72 md:p-10",
        active ? "bg-maroon text-cream" : "bg-cream",
      )}
    >
      {armed && media.length > 0 && (
        <div aria-hidden="true" className={cn("absolute inset-0 -z-10 transition-opacity duration-700", active ? "opacity-100" : "opacity-0")}>
          {media.map((src, i) => (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-all duration-1000 ease-out",
                i === current ? "scale-100 opacity-100" : "scale-110 opacity-0",
              )}
            >
              {isVideo(src) ? (
                <TileVideo src={src} playing={active && i === current} />
              ) : (
                <Image src={mediaUrl(src)} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/85 via-maroon-deep/25 to-maroon-deep/70" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={cn("font-display text-sm font-bold transition-colors", active ? "text-cream/75" : "text-maroon")}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {media.length > 0 && (
          <span
            aria-hidden="true"
            className={cn(
              "flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-opacity duration-500",
              active ? "opacity-90" : "opacity-0",
            )}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#ff3b3b]" /> Live
          </span>
        )}
      </div>
      <h3 className={cn("font-display mt-8 text-2xl font-extrabold tracking-tight transition-all duration-500", active && "md:translate-y-[-2px]")}>{title}</h3>
      {description && (
        <p className={cn("mt-3 leading-relaxed transition-colors duration-500", active ? "text-cream/85" : "text-muted")}>{description}</p>
      )}
      {media.length > 1 && (
        <div aria-hidden="true" className={cn("absolute inset-x-8 bottom-6 flex gap-1.5 transition-opacity duration-500 md:inset-x-10", active ? "opacity-100" : "opacity-0")}>
          {media.map((src, i) => (
            <span key={src} className={cn("h-[3px] flex-1 rounded-full transition-colors duration-500", i === current ? "bg-cream" : "bg-cream/25")} />
          ))}
        </div>
      )}
    </div>
  );
}
