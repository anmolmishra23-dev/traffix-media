import { cn, posterFor } from "@/lib/utils";
import { AutoVideo } from "./AutoVideo";

function columns(clips: string[], count: number) {
  return Array.from({ length: count }, (_, c) => clips.filter((_, i) => i % count === c));
}

/**
 * A tilted wall of behind-the-scenes clips drifting slowly up and down (Site settings → background videos).
 * Purely decorative: sits behind a section's content. Phones get 3 columns, larger screens 5.
 */
export function BtsWall({ clips, className }: { clips: string[]; className?: string }) {
  if (!clips.length) return null;
  const layouts = [
    { cols: columns(clips, 3), className: "flex md:hidden" },
    { cols: columns(clips, 5), className: "hidden md:flex" },
  ];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {layouts.map((layout, l) => (
        <div key={l} className={cn("absolute -inset-[15%] -rotate-[8deg] gap-3 md:gap-4", layout.className)}>
          {layout.cols.map((col, c) => (
            <div
              key={c}
              className={cn("wall-drift flex flex-1 flex-col gap-3 md:gap-4", c % 2 === 1 && "wall-drift-reverse mt-[-18%]")}
              style={{ animationDelay: `${-c * 3}s` }}
            >
              {[...col, ...col].map((src, i) => (
                <div key={`${src}-${i}`} className="relative aspect-[9/16] shrink-0 overflow-hidden rounded-2xl bg-black/30">
                  <AutoVideo src={src} poster={posterFor(src)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
