import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { AutoVideo } from "@/components/site/AutoVideo";
import { BtsWall } from "@/components/site/BtsWall";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { Spotlight } from "@/components/site/Spotlight";
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
  // the last section is shown as the vision statement over video
  const story = sections.length > 1 ? sections.slice(0, -1) : sections;
  const vision = sections.length > 1 ? sections[sections.length - 1] : null;
  const reels = (settings.showreel_videos ?? []).slice(0, 3);
  // behind-the-scenes clips, starting from a different one than the home page
  const bts = settings.hero_videos ?? [];
  const wall = [...bts.slice(4), ...bts.slice(0, 4)];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="px-3 pt-2 md:px-5">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-maroon-deep px-5 pt-14 pb-20 text-cream md:rounded-[2.5rem] md:px-8 md:pt-24 md:pb-28">
          <BtsWall clips={wall} className="-z-20 opacity-60" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-maroon-deep/75 lg:bg-transparent lg:bg-gradient-to-r lg:from-maroon-deep lg:via-maroon-deep/85 lg:to-maroon-deep/20" />
          <Spotlight className="-z-10" />
          <div className="relative mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/75 uppercase">
                <span className="size-2 animate-pulse rounded-full bg-[#ff3b3b]" /> About Traffix Media · behind the scenes
              </p>
              <h1 className="font-display mt-5 text-[clamp(2.3rem,4.6vw,4.2rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance uppercase">
                {settings.about_heading}
              </h1>
              {intro[0] && <p className="mt-8 max-w-2xl text-xl leading-relaxed text-cream/85 md:text-2xl text-pretty">{intro[0]}</p>}
            </Reveal>
          </div>
        </div>
      </section>

      {intro.length > 1 && (
        <section className="px-5 pt-16 md:px-8 md:pt-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
            {intro.slice(1).map((p, i) => (
              <Reveal key={i} delay={(i % 2) * 80}>
                <p className="text-lg leading-relaxed text-ink/80 text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- The work speaks ---------- */}
      {highlights.length > 0 && (
        <section className="relative isolate mt-16 overflow-hidden bg-maroon px-5 py-20 text-cream md:mt-24 md:px-8 md:py-28">
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
                <Reveal as="li" key={h.id} delay={i * 90} className="rounded-3xl border border-cream/15 bg-cream/[0.06] p-8 backdrop-blur-sm transition duration-500 ease-out hover:-translate-y-2 hover:border-cream/40 hover:bg-cream hover:text-maroon hover:shadow-2xl hover:shadow-black/30 md:p-10 [&:hover_p]:text-maroon/80">
                  <p className={cn("font-display font-black tracking-tight", h.value.length > 6 ? "text-4xl md:text-5xl" : "text-6xl md:text-7xl")}>{h.value}</p>
                  <p className="font-display mt-4 text-xl font-extrabold tracking-tight">{h.label}</p>
                  {h.description && <p className="mt-3 leading-relaxed text-cream/70">{h.description}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Story: one table, each row lights up under the cursor ---------- */}
      {story.length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">How we work</p>
            </Reveal>
            <ol className="mt-8 border-t border-line">
              {story.map((s, i) => {
                const [lead, ...rest] = paragraphs(s.body);
                return (
                  <Reveal
                    as="li"
                    key={s.id}
                    delay={Math.min(i, 3) * 60}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-line px-3 py-10 transition-colors duration-300 hover:border-transparent hover:bg-maroon hover:text-cream md:grid-cols-[5rem_minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-x-10 md:rounded-3xl md:px-8 md:py-14"
                  >
                    <span className="font-display pt-1 text-sm font-bold text-maroon transition-colors group-hover:text-cream/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-3xl leading-[0.95] font-black tracking-tight uppercase transition-transform duration-300 group-hover:translate-x-1 md:text-5xl">
                      {s.title}
                    </h2>
                    <div className="col-start-2 space-y-4 md:col-start-3 md:row-start-1">
                      {lead && <p className="font-display text-xl leading-snug font-extrabold tracking-tight text-pretty md:text-2xl">{lead}</p>}
                      {rest.map((p, j) => (
                        <p key={j} className="leading-relaxed text-ink/75 transition-colors text-pretty group-hover:text-cream/80">
                          {p}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Vision ---------- */}
      {vision && (
        <section className="relative isolate overflow-hidden bg-maroon px-5 py-24 text-cream md:px-8 md:py-36">
          {reels.length > 0 && (
            <div aria-hidden="true" className="absolute inset-0 -z-20 flex gap-2 opacity-60 mix-blend-luminosity md:gap-3">
              {reels.map((src, i) => (
                <div key={src} className={cn("relative flex-1 overflow-hidden", i === 2 && "hidden md:block")}>
                  <AutoVideo src={src} poster={posterFor(src)} />
                </div>
              ))}
            </div>
          )}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon via-maroon/60 to-maroon-deep" />
          <Spotlight className="-z-10" />
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
      <section className="relative isolate overflow-hidden bg-ink px-5 py-20 text-cream md:px-8 md:py-24">
        <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10" />
        <Spotlight className="-z-10 opacity-70" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">Brands that trust us</h2>
          </Reveal>
          <ul className="mt-10 flex flex-wrap items-center gap-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex h-14 items-center gap-3 rounded-full border border-cream/15 bg-ink/40 px-5 text-cream/85 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-cream hover:bg-cream hover:text-maroon"
                >
                  {p.logo_url && (
                    <Image
                      src={mediaUrl(p.logo_url)}
                      alt=""
                      width={72}
                      height={32}
                      className="h-7 w-auto max-w-[72px] object-contain brightness-0 invert transition group-hover:invert-0"
                    />
                  )}
                  <span className="font-medium">{p.title}</span>
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
