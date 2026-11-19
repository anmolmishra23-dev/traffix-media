"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { cn, coverOf, initials, mediaUrl } from "@/lib/utils";
import { HeartBubble } from "@/components/icons";

// Hero visual for a video production company: a camera viewfinder (REC, running timecode,
// framing guides) that cycles through clients as "scenes".
// Which projects play, and in what order, is set per project in the admin ("Home page camera position").

const SCENE_MS = 6500;
const FPS = 25;
const tones = [
  "from-maroon via-maroon-2 to-maroon-deep",
  "from-[#2a1f20] via-ink to-black",
  "from-maroon-deep via-[#2a1f20] to-ink",
];

export function HeroViewfinder({
  projects,
  brands,
  industries,
}: {
  projects: Project[];
  brands: string;
  industries: string;
}) {
  const [index, setIndex] = useState(0);
  const timecode = useRef<HTMLSpanElement>(null);
  const picked = projects.filter((p) => p.hero_order != null).sort((a, b) => a.hero_order! - b.hero_order!);
  // nothing picked yet: featured brands, the ones with video first
  const scenes = (
    picked.length
      ? picked
      : projects.filter((p) => p.featured).sort((a, b) => Number(b.videos.length > 0) - Number(a.videos.length > 0))
  ).slice(0, 10);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const pad = (n: number) => String(n).padStart(2, "0");
    // Timecode is written straight to the DOM (25 times a second) to avoid re-rendering the hero
    const tick = setInterval(() => {
      const f = Math.floor(((performance.now() - start) / 1000) * FPS);
      const s = Math.floor(f / FPS);
      if (timecode.current) {
        timecode.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % FPS)}`;
      }
    }, 1000 / FPS);
    const scene = setInterval(() => setIndex((i) => (i + 1) % Math.max(scenes.length, 1)), SCENE_MS);
    return () => {
      clearInterval(tick);
      clearInterval(scene);
    };
  }, [scenes.length]);

  if (!scenes.length) return null;
  const current = scenes[index];

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px]">
      {/* ambient light: a blurred copy of the current scene glows behind the camera */}
      <div aria-hidden="true" className="absolute -inset-[6%] overflow-hidden rounded-[3rem] opacity-60 blur-3xl">
        {scenes.map((p, i) =>
          coverOf(p) ? (
            <Image
              key={p.id}
              src={mediaUrl(coverOf(p)!)}
              alt=""
              fill
              sizes="200px"
              className={cn("object-cover transition-opacity duration-[1500ms]", i === index ? "opacity-100" : "opacity-0")}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-maroon/30 mix-blend-multiply" />
      </div>

      {/* camera body / viewfinder */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-ink shadow-2xl shadow-maroon/30 ring-1 ring-ink/10">
        {/* scenes */}
        {scenes.map((p, i) => (
          <div
            key={p.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-all duration-[1200ms] ease-out",
              tones[i % tones.length],
              i === index ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
          >
            {p.videos.length > 0 && i === index ? (
              <>
                <video
                  key={p.videos[0]}
                  src={mediaUrl(p.videos[0])}
                  poster={coverOf(p) ? mediaUrl(coverOf(p)!) : undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/40" />
              </>
            ) : coverOf(p) ? (
              <>
                <Image src={mediaUrl(coverOf(p)!)} alt="" fill priority={i === 0} sizes="480px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/40" />
              </>
            ) : (
              <span className="font-display absolute inset-0 flex items-center justify-center text-[11rem] leading-none font-black tracking-tighter text-cream/[0.08] select-none">
                {initials(p.title)}
              </span>
            )}
          </div>
        ))}

        {/* rule-of-thirds guides */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-y-0 left-1/3 w-px bg-cream/10" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-cream/10" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-cream/10" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-cream/10" />
        </div>

        {/* corner brackets */}
        {["top-3.5 left-3.5 border-t-2 border-l-2", "top-3.5 right-3.5 border-t-2 border-r-2", "bottom-3.5 left-3.5 border-b-2 border-l-2", "bottom-3.5 right-3.5 border-b-2 border-r-2"].map(
          (c) => (
            <span key={c} aria-hidden="true" className={cn("pointer-events-none absolute size-6 rounded-[3px] border-cream/80", c)} />
          ),
        )}

        {/* focus box */}
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute top-0 left-0 size-3 border-t border-l border-cream/70" />
          <span className="absolute top-0 right-0 size-3 border-t border-r border-cream/70" />
          <span className="absolute bottom-0 left-0 size-3 border-b border-l border-cream/70" />
          <span className="absolute right-0 bottom-0 size-3 border-r border-b border-cream/70" />
        </span>

        {/* top HUD */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-11 pt-10 font-mono text-[11px] font-medium tracking-wider text-cream/90">
          <span className="flex items-center gap-2">
            <span className="size-2.5 animate-pulse rounded-full bg-[#ff3b3b] shadow-[0_0_10px_#ff3b3b]" />
            REC
            <span ref={timecode} className="ml-1 tabular-nums">
              00:00:00:00
            </span>
          </span>
          <span className="flex items-center gap-2">
            4K · {FPS}fps
            <svg viewBox="0 0 26 12" className="h-3 w-6" aria-hidden="true">
              <rect x="0.5" y="0.5" width="22" height="11" rx="2" fill="none" stroke="currentColor" />
              <rect x="2.5" y="2.5" width="15" height="7" rx="1" fill="currentColor" />
              <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* slate */}
        <Link
          href={`/work/${current.slug}`}
          className="group/slate absolute inset-x-11 bottom-11 block rounded-xl bg-black/45 p-4 text-cream backdrop-blur-md transition hover:bg-black/60"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-cream/60 uppercase">
            <span>Scene {String(index + 1).padStart(2, "0")}</span>
            <span>{current.category?.name}</span>
          </div>
          <p key={current.id} className="font-display mt-1.5 animate-[rise_0.6s_ease-out_both] truncate text-2xl leading-tight font-extrabold tracking-tight">
            {current.title}
          </p>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-cream/20">
            <div key={index} className="animate-scene h-full origin-left rounded-full bg-cream" />
          </div>
        </Link>
      </div>

      {/* clapperboard */}
      <div className="animate-float absolute -top-5 -left-4 z-10 [--r:-12deg] md:-left-8" aria-hidden="true">
        <svg viewBox="0 0 64 56" className="size-16 drop-shadow-xl md:size-20">
          <path d="M6 22h52v28a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V22Z" fill="var(--color-maroon)" />
          <path d="M6 22h52" stroke="var(--color-cream)" strokeWidth="1.5" opacity=".3" />
          <path d="M14 34h36M14 42h24" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <g transform="rotate(-14 6 20)">
            <rect x="6" y="9" width="52" height="11" rx="2" fill="var(--color-ink)" />
            <path d="M14 9 8 20M26 9l-6 11M38 9l-6 11M50 9l-6 11" stroke="var(--color-cream)" strokeWidth="4" />
          </g>
        </svg>
      </div>

      {/* stats */}
      <div className="absolute -bottom-5 -left-3 z-10 rounded-2xl bg-white px-5 py-3.5 shadow-xl shadow-maroon/10 md:-left-8">
        <p className="font-display text-3xl font-black text-maroon">{brands}</p>
        <p className="text-sm text-muted">brands served</p>
      </div>
      <div className="absolute top-[18%] -right-3 z-10 rounded-2xl bg-maroon px-5 py-3.5 text-cream shadow-xl md:-right-8">
        <p className="font-display text-3xl font-black">{industries}</p>
        <p className="text-sm text-cream/75">industries</p>
      </div>
      <HeartBubble className="animate-float absolute -right-2 bottom-[22%] z-10 size-12 text-cream drop-shadow-lg [animation-delay:1.8s] [--r:10deg] md:-right-6" />
    </div>
  );
}
