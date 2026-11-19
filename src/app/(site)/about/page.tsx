import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { AutoVideo } from "@/components/site/AutoVideo";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { getAboutSections, getHighlights, getProjects, getSettings, getTeam } from "@/lib/data";
import { cn, initials, mediaUrl, posterFor } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "About",
    description: settings.about_body?.split(/\n{2,}/)[0]?.slice(0, 155) ?? "About Traffix Media.",
    alternates: { canonical: "/about" },
  };
}

const paragraphs = (text: string | null) => (text ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export default async function AboutPage() {
  const [settings, projects, sections, highlights, team] = await Promise.all([
    getSettings(),
    getProjects(),
    getAboutSections(),
    getHighlights(),
    getTeam(),
  ]);

  const intro = paragraphs(settings.about_body);
  const collage = projects.filter((p) => p.cover_image_url && !/\/video-\d+\./.test(p.cover_image_url)).slice(0, 4);
  const reel = projects.find((p) => p.videos.length > 0);
  // the last section is shown as the vision statement over video
  const story = sections.length > 1 ? sections.slice(0, -1) : sections;
  const vision = sections.length > 1 ? sections[sections.length - 1] : null;
  const showreel = settings.showreel_videos?.[0];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden px-5 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] size-[700px] rounded-full bg-maroon/[0.08] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">About Traffix Media</p>
            <h1 className="font-display mt-5 text-[clamp(2.3rem,4.2vw,3.9rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance uppercase">
              {settings.about_heading}
            </h1>
            {intro[0] && <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink/85 md:text-2xl text-pretty">{intro[0]}</p>}
          </Reveal>

          <Reveal delay={150} className="relative mx-auto grid w-full max-w-[480px] grid-cols-2 gap-4 pb-10">
            {collage.slice(0, 2).map((p, i) => (
              <div key={p.id} className={cn("relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-ink/10", i === 1 && "translate-y-10")}>
                <Image src={mediaUrl(p.cover_image_url!)} alt={`${p.title} — work by Traffix Media`} fill sizes="240px" className="object-cover" />
              </div>
            ))}
            {reel ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink shadow-xl shadow-ink/10">
                <AutoVideo src={reel.videos[0]} poster={posterFor(reel.videos[0])} />
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-wider text-cream backdrop-blur">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#ff3b3b]" /> REC
                </span>
              </div>
            ) : collage[2] ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image src={mediaUrl(collage[2].cover_image_url!)} alt="" fill sizes="240px" className="object-cover" />
              </div>
            ) : null}
            {collage[3] && (
              <div className="relative aspect-[4/5] translate-y-10 overflow-hidden rounded-3xl shadow-xl shadow-ink/10">
                <Image src={mediaUrl(collage[3].cover_image_url!)} alt="" fill sizes="240px" className="object-cover" />
              </div>
            )}
          </Reveal>
        </div>

        {intro.length > 1 && (
          <div className="relative mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
            {intro.slice(1).map((p, i) => (
              <Reveal key={i} delay={(i % 2) * 80}>
                <p className="text-lg leading-relaxed text-ink/80 text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Story sections ---------- */}
      {story.map((s, i) => (
        <section key={s.id} className={cn("px-5 py-20 md:px-8 md:py-28", i % 2 === 0 ? "bg-ink text-cream" : "bg-cream-2/60")}>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={cn("font-display text-sm font-bold", i % 2 === 0 ? "text-[#f0b9bf]" : "text-maroon")}>{String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-display mt-4 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">{s.title}</h2>
            </Reveal>
            <div className="space-y-6">
              {paragraphs(s.body).map((p, j) => (
                <Reveal key={j} delay={j * 60}>
                  <p
                    className={cn(
                      "leading-relaxed text-pretty",
                      j === 0 ? "font-display text-2xl font-extrabold tracking-tight md:text-3xl" : "text-lg",
                      j > 0 && (i % 2 === 0 ? "text-cream/75" : "text-ink/80"),
                    )}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ---------- The work speaks ---------- */}
      {highlights.length > 0 && (
        <section className="relative overflow-hidden bg-maroon px-5 py-20 text-cream md:px-8 md:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[600px] rounded-full bg-maroon-2/60 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
              <h2 className="font-display text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
                {settings.highlights_heading ?? "The work speaks"}
              </h2>
              {settings.highlights_intro && <p className="max-w-md text-lg text-cream/75 md:justify-self-end">{settings.highlights_intro}</p>}
            </Reveal>
            <ul className={cn("mt-14 grid grid-cols-1 gap-5", highlights.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
              {highlights.map((h, i) => (
                <Reveal as="li" key={h.id} delay={i * 90} className="rounded-3xl border border-cream/15 bg-cream/[0.06] p-8 backdrop-blur-sm md:p-10">
                  <p className={cn("font-display font-black tracking-tight", h.value.length > 6 ? "text-4xl md:text-5xl" : "text-6xl md:text-7xl")}>{h.value}</p>
                  <p className="font-display mt-4 text-xl font-extrabold tracking-tight">{h.label}</p>
                  {h.description && <p className="mt-3 leading-relaxed text-cream/70">{h.description}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Vision ---------- */}
      {vision && (
        <section className="relative overflow-hidden bg-ink px-5 py-24 text-cream md:px-8 md:py-36">
          {showreel && (
            <div aria-hidden="true" className="absolute inset-0 opacity-25">
              <AutoVideo src={showreel} poster={posterFor(showreel)} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="font-mono text-xs tracking-[0.2em] text-[#f0b9bf] uppercase">{vision.title}</p>
              {paragraphs(vision.body).map((p, j) => (
                <p
                  key={j}
                  className={cn(
                    "leading-relaxed text-pretty",
                    j === 0 ? "font-display mt-6 text-3xl font-black tracking-tight uppercase md:text-5xl md:leading-[1.05]" : "mx-auto mt-6 max-w-2xl text-lg text-cream/75",
                  )}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Team ---------- */}
      {team.length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">The team</p>
                <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">The people behind it</h2>
              </div>
              <Link href="/contact" className="group inline-flex items-center gap-2 font-semibold text-maroon">
                Work with us <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </Link>
            </Reveal>
            <ul className={cn("mt-14 grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2", team.length >= 3 && "lg:grid-cols-3")}>
              {team.map((m, i) => (
                <Reveal as="li" key={m.id} delay={i * 100} className={cn(i % 3 === 1 && "lg:translate-y-12")}>
                  <figure className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-2">
                      {m.photo_url ? (
                        <Image
                          src={mediaUrl(m.photo_url)}
                          alt={`${m.name}${m.role ? `, ${m.role}` : ""} at Traffix Media`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <span className="font-display absolute inset-0 flex items-center justify-center text-7xl font-black text-maroon/30">{initials(m.name)}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/85 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
                      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream md:p-7">
                        <p className="font-display text-2xl font-black tracking-tight uppercase md:text-3xl">{m.name}</p>
                        {m.role && <p className="mt-1 text-cream/80">{m.role}</p>}
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Brands ---------- */}
      <section className="bg-ink px-5 py-20 text-cream md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">Brands that trust us</h2>
          </Reveal>
          <ul className="mt-10 flex flex-wrap items-center gap-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/work/${p.slug}`}
                  className="flex h-12 items-center rounded-full border border-cream/15 px-5 text-cream/80 transition hover:border-cream hover:bg-cream hover:text-maroon"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Closing line ---------- */}
      {settings.about_closing && (
        <section className="px-5 py-24 md:px-8 md:py-32">
          <Reveal className="mx-auto max-w-5xl text-center">
            <p className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1] font-black tracking-tight text-balance uppercase">
              {settings.about_closing.split(/(?<=\.)\s+/).map((part, i) => (
                <span key={i} className={cn("block", i > 0 && "text-maroon")}>
                  {part}
                </span>
              ))}
            </p>
          </Reveal>
        </section>
      )}

      <CtaBand />
    </>
  );
}
