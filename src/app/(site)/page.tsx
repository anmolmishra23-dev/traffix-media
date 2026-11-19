import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HeartBubble } from "@/components/icons";
import { BtsWall } from "@/components/site/BtsWall";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroViewfinder } from "@/components/site/HeroViewfinder";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { ServiceTile } from "@/components/site/ServiceTile";
import { Spotlight } from "@/components/site/Spotlight";
import { TestimonialSlider } from "@/components/site/TestimonialSlider";
import { getProjects, getProjectsByCategory, getServices, getSettings, getTestimonials } from "@/lib/data";
import { SITE_NAME, SITE_URL, cn, coverOf, instagramUrl, mediaUrl } from "@/lib/utils";

export default async function HomePage() {
  const [settings, projects, groups, services, testimonials] = await Promise.all([
    getSettings(),
    getProjects(),
    getProjectsByCategory(),
    getServices(),
    getTestimonials(),
  ]);

  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 9);
  // Headline: every sentence on its own line, the last one (the punchline) in maroon
  const lines = (settings.hero_heading ?? "Be seen. Be known.").split(/(?<=[.?!])\s+/).filter(Boolean);
  const brands = settings.stat_brands || `${projects.length}+`;
  const industries = settings.stat_industries || `${groups.length}+`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-circle.png`,
    slogan: settings.tagline ?? undefined,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    sameAs: [instagramUrl(settings.instagram)].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- Hero ---------- */}
      {/* colour panel over a drifting wall of behind-the-scenes clips; the light follows the cursor and changes colour */}
      <section className="px-3 pt-2 md:px-5">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-maroon-deep px-5 pt-12 pb-20 text-cream md:rounded-[2.5rem] md:px-8 md:pt-20 md:pb-28">
          <BtsWall clips={settings.hero_videos ?? []} className="-z-20 opacity-55" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-maroon-deep/75 lg:bg-transparent lg:bg-gradient-to-r lg:from-maroon-deep lg:via-maroon-deep/85 lg:to-maroon-deep/35" />
          <Spotlight className="-z-10" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-sm font-medium text-cream/85 backdrop-blur-sm">
                  <span className="size-2 animate-pulse rounded-full bg-[#ff3b3b]" /> Creative marketing &amp; video production
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-display mt-7 text-[clamp(2.5rem,5.2vw,4.6rem)] leading-[0.95] font-black tracking-[-0.03em] text-balance uppercase">
                  {lines.map((line, i) => (
                    <span key={i} className={i === lines.length - 1 && lines.length > 1 ? "mt-2 block text-[#f0b9bf]" : "block"}>
                      {line}
                    </span>
                  ))}
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/80 md:text-xl text-pretty">{settings.hero_subheading}</p>
              </Reveal>
              <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 font-semibold text-maroon transition hover:bg-white"
                >
                  Start a project <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-4 font-semibold transition hover:border-cream hover:bg-cream/10"
                >
                  See our work
                </Link>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <HeroViewfinder projects={projects} brands={brands} industries={industries} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Client marquee ---------- */}
      <section aria-label="Brands we have worked with" className="mt-8 overflow-hidden border-y border-maroon-deep bg-maroon py-6 text-cream md:mt-10">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {projects.map((p) => (
                <li key={p.id} className="flex items-center">
                  <span className="flex items-center gap-4 px-8">
                    {p.logo_url && (
                      <Image
                        src={mediaUrl(p.logo_url)}
                        alt=""
                        width={160}
                        height={64}
                        className="h-10 w-auto max-w-[120px] object-contain brightness-0 invert md:h-12"
                      />
                    )}
                    <span className="font-display text-2xl font-extrabold tracking-tight whitespace-nowrap uppercase md:text-3xl">{p.title}</span>
                  </span>
                  <HeartBubble className="size-6 shrink-0 text-cream/40" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <h2 className="font-display max-w-2xl text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
                Brands we&apos;ve made noticeable
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/work" className="group inline-flex items-center gap-2 font-semibold text-maroon">
                View all work <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 3) * 90}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden bg-maroon-deep px-5 py-20 text-cream md:px-8 md:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 size-[560px] rounded-full bg-maroon-2/40 blur-3xl" />
            <div className="absolute -right-32 -bottom-48 size-[520px] rounded-full bg-maroon/60 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <TestimonialSlider
              items={testimonials.map((t) => {
                const p = projects.find((x) => x.id === t.project_id);
                return {
                  id: t.id,
                  quote: t.quote,
                  name: t.name,
                  role: t.role,
                  company: t.company,
                  logo: p?.logo_url ?? null,
                  cover: p?.cover_image_url ?? null,
                  slug: p?.slug ?? null,
                };
              })}
            />
          </div>
        </section>
      )}

      {/* ---------- Services ---------- */}
      {services.length > 0 && (
        <section id="services" className="scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">What we do</p>
              <h2 className="font-display mt-3 max-w-3xl text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
                Everything your brand needs to be seen
              </h2>
            </Reveal>
            <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.id}
                  delay={(i % 4) * 70}
                  // lead service spans two columns when the count is odd, so the grid has no gaps
                  className={cn("bg-cream", i === 0 && services.length % 2 === 1 && "sm:col-span-2")}
                >
                  <ServiceTile index={i} title={s.title} description={s.description} media={s.media ?? []} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Industries ---------- */}
      <section className="relative isolate overflow-hidden bg-ink px-5 py-20 text-cream md:px-8 md:py-28">
        {/* slow-moving colour behind the list, plus a light that follows the cursor */}
        <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10" />
        <Spotlight className="-z-10 opacity-70" />
        <div className="mx-auto max-w-7xl">
          <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-cream/50 uppercase">Industries</p>
              <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
                {industries} industries.
                <br />
                <span className="text-maroon-2">One obsession.</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-cream/65 md:justify-self-end">
              From luxury real estate to cult consumer brands, the platforms keep changing but the goal stays the same. Get seen. Get remembered.
            </p>
          </Reveal>

          <ul className="mt-14 border-t border-cream/10">
            {groups.map(({ category, projects: items }, i) => {
              const previews = items.map(coverOf).filter((c): c is string => Boolean(c)).slice(0, 2);
              return (
              <Reveal as="li" key={category.id} delay={Math.min(i, 4) * 40}>
                <Link
                  href={`/work#${category.slug}`}
                  className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-2 border-b border-cream/10 px-3 py-6 transition-colors duration-300 hover:border-transparent hover:bg-maroon md:grid-cols-[5rem_1.1fr_1.6fr_auto] md:gap-4 md:rounded-2xl md:px-6 md:py-8 lg:pr-48"
                >
                  {/* their work pops up on hover */}
                  {previews.length > 0 && (
                    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-20 hidden h-28 w-36 -translate-y-1/2 lg:block">
                      {previews.map((src, k) => (
                        <Image
                          key={src}
                          src={mediaUrl(src)}
                          alt=""
                          width={96}
                          height={120}
                          className={cn(
                            "absolute top-0 h-28 w-[5.5rem] rounded-xl object-cover opacity-0 shadow-2xl shadow-black/50 ring-2 ring-cream/80 transition duration-500 ease-out group-hover:opacity-100",
                            k === 0
                              ? "right-0 translate-y-4 rotate-0 scale-75 group-hover:translate-y-0 group-hover:rotate-6 group-hover:scale-100"
                              : "right-12 translate-y-4 rotate-0 scale-75 delay-75 group-hover:translate-y-1 group-hover:-rotate-6 group-hover:scale-95",
                          )}
                        />
                      ))}
                    </span>
                  )}
                  <span className="font-display col-start-1 row-start-1 text-sm font-bold text-cream/40 group-hover:text-cream/80 md:col-auto md:row-auto">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display col-start-2 row-start-1 min-w-0 text-xl font-extrabold tracking-tight [overflow-wrap:anywhere] uppercase transition group-hover:translate-x-2 sm:text-2xl md:col-auto md:row-auto md:text-4xl">
                    {category.name}
                  </span>
                  <span className="col-span-2 col-start-2 row-start-2 text-cream/55 group-hover:text-cream/90 md:col-span-1 md:col-start-auto md:row-auto">
                    {items.map((p) => p.title).join(" · ")}
                  </span>
                  <ArrowUpRight className="col-start-3 row-start-1 size-5 justify-self-end text-cream/40 transition group-hover:rotate-45 group-hover:text-cream md:col-auto md:row-auto" />
                </Link>
              </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* cream breathing room so the dark industries band and the dark CTA read as two sections */}
      <div aria-hidden="true" className="h-20 md:h-28" />

      <CtaBand />
    </>
  );
}
