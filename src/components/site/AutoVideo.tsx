"use client";

import { useEffect, useRef } from "react";
import { cn, mediaUrl } from "@/lib/utils";

/**
 * Silent looping video that only downloads and plays while it is on screen
 * (so a page with many clips stays fast). Shows the poster until then.
 */
export function AutoVideo({
  src,
  poster,
  className,
  label,
}: {
  src: string;
  poster?: string | null;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      src={mediaUrl(src)}
      poster={poster ? mediaUrl(poster) : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
