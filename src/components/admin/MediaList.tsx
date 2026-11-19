"use client";

import { isVideoPath } from "@/lib/admin-api";
import { mediaUrl, posterFor } from "@/lib/utils";

const fileInput =
  "block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium";

/** Thumbnails of the current photos/videos (tick to remove) plus a file picker to add more. Read with applyMediaList(). */
export function MediaList({
  name,
  items,
  label,
  hint,
  images = false,
}: {
  name: string;
  items: string[];
  label: string;
  hint?: string;
  images?: boolean;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      {items.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {items.map((src) => (
            <li key={src} className="w-20">
              <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-zinc-900">
                {isVideoPath(src) ? (
                  posterFor(src) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(posterFor(src)!)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <video src={mediaUrl(src)} muted preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrl(src)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                {isVideoPath(src) && <span className="absolute top-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">▶</span>}
              </div>
              <label className="mt-1 flex items-center gap-1 text-[11px] text-zinc-600">
                <input type="checkbox" name={`remove_${name}`} value={src} className="size-3 accent-[#6a1a23]" /> Remove
              </label>
            </li>
          ))}
        </ul>
      )}
      <input name={name} type="file" multiple accept={images ? "image/*,video/mp4,video/webm" : "video/mp4,video/webm"} className={fileInput} />
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </div>
  );
}
