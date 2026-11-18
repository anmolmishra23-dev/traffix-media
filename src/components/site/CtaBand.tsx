import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { getSettings } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AutoVideo } from "./AutoVideo";

// "Ready to be seen?" — set against a wall of showreel clips (Site settings → showreel videos).
export async function CtaBand() {
  const settings = await getSettings();
  const clips = settings.showreel_videos ?? [];

  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-maroon-deep text-cream">
        {/* video wall */}
        {clips.length > 0 && (
          <div aria-hidden="true" className="absolute inset-y-0 right-0 flex w-full gap-2 p-2 md:w-[62%]">
            {clips.slice(0, 4).map((src, i) => (
              <div
                key={src}
                className={cn(
                  "relative flex-1 overflow-hidden rounded-2xl",
                  i % 2 === 1 && "translate-y-8",
                  i >= 2 && "hidden sm:block",
                )}
              >
                <AutoVideo src={src} poster={src.replace(/\.mp4$/, ".jpg")} />
              </div>
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep via-maroon-deep/90 to-maroon-deep/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-maroon-deep/40 md:hidden" />

        <div className="relative px-6 py-16 md:max-w-[58%] md:px-16 md:py-24">
          <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/70 uppercase">
            <span className="size-2 animate-pulse rounded-full bg-[#ff3b3b]" /> Got a brand to grow?
          </p>
          <h2 className="font-display mt-4 text-5xl leading-[0.95] font-black tracking-tight uppercase md:text-7xl">
            Ready to be <span className="text-[#f0b9bf]">seen?</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-cream/80">
            Tell us about your brand and what you want to achieve. We&apos;ll get back to you within a day.
          </p>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 font-semibold text-maroon transition hover:bg-white"
          >
            Start a project
            <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
