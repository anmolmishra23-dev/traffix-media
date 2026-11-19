import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HeartBubble } from "@/components/icons";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroViewfinder } from "@/components/site/HeroViewfinder";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { TestimonialSlider } from "@/components/site/TestimonialSlider";
import { getProjects, getProjectsByCategory, getServices, getSettings, getTestimonials } from "@/lib/data";
import { SITE_NAME, SITE_URL, cn, instagramUrl, mediaUrl } from "@/lib/utils";

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
      <section className="relative overflow-hidden px-5 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
        {/* backdrop: soft studio light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] size-[720px] rounded-full bg-maroon/[0.09] blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-10%] size-[520px] rounded-full bg-sand/60 blur-3xl" />
        </div>
        <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/50 px-4 py-1.5 text-sm font-medium text-muted">
                <span className="size-2 rounded-full bg-maroon" /> Creative marketing &amp; video production
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-7 text-[clamp(2.5rem,5.2vw,4.6rem)] leading-[0.95] font-black tracking-[-0.03em] text-balance uppercase">
                {lines.map((line, i) => (
                  <span key={i} className={i === lines.length - 1 && lines.length > 1 ? "mt-2 block text-maroon" : "block"}>
                    {line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl text-pretty">{settings.hero_subheading}</p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-maroon px-7 py-4 font-semibold text-cream transition hover:bg-maroon-deep"
              >
                Start a project <ArrowUpRight className="size-5 transition group-hover:rotate-45" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-4 font-semibold transition hover:border-maroon hover:text-maroon"
              >
                See our work
              </Link>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <HeroViewfinder projects={featured} brands={brands} industries={industries} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Client marquee ---------- */}
      <section aria-label="Brands we have worked with" className="overflow-hidden border-y border-maroon-deep bg-maroon py-6 text-cream">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {projects.map((p) => (
                <li key={p.id} className="flex items-center">
                  <span className="flex items-center px-8">
                    {/* logo when we have one (every logo already includes the brand name), otherwise the name */}
                    {p.logo_url ? (
                      <Image
                        src={mediaUrl(p.logo_url)}
                        alt={dup === 0 ? p.title : ""}
                        width={220}
                        height={88}
                        className="h-14 w-auto max-w-[200px] object-contain brightness-0 invert md:h-16"
                      />
                    ) : (
                      <span className="font-display text-2xl font-extrabold tracking-tight whitespace-nowrap uppercase md:text-3xl">{p.title}</span>
                    )}
                  </span>
                  <HeartBubble className="size-6 shrink-0 text-cream/40" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ---------- Selected work ---------- */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">Selected work</p>
              <h2 className="font-display mt-3 max-w-2xl text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
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

      {/* ---------- Industries ---------- */}
      <section className="bg-ink px-5 py-20 text-cream md:px-8 md:py-28">
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
              From luxury real estate to cult consumer brands — the platforms change, the goal doesn&apos;t: get seen, get remembered.
            </p>
          </Reveal>

          <ul className="mt-14 border-t border-cream/10">
            {groups.map(({ category, projects: items }, i) => (
              <Reveal as="li" key={category.id} delay={Math.min(i, 4) * 40}>
                <Link
                  href={`/work#${category.slug}`}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-cream/10 px-3 py-6 transition-colors duration-300 hover:border-transparent hover:bg-maroon md:grid-cols-[5rem_1.1fr_1.6fr_auto] md:rounded-2xl md:px-6 md:py-8"
                >
                  <span className="font-display text-sm font-bold text-cream/40 group-hover:text-cream/80">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl font-extrabold tracking-tight uppercase transition group-hover:translate-x-2 md:text-4xl">
                    {category.name}
                  </span>
                  <span className="col-span-2 col-start-2 text-cream/55 group-hover:text-cream/90 md:col-span-1 md:col-start-auto">
                    {items.map((p) => p.title).join(" · ")}
                  </span>
                  <ArrowUpRight className="row-start-1 size-5 justify-self-end text-cream/40 transition group-hover:rotate-45 group-hover:text-cream md:row-auto" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

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
                  className={cn(
                    "group bg-cream p-8 transition-colors duration-300 hover:bg-maroon md:p-10",
                    // lead service spans two columns when the count is odd, so the grid has no gaps
                    i === 0 && services.length % 2 === 1 && "sm:col-span-2",
                  )}
                >
                  <span className="font-display text-sm font-bold text-maroon transition-colors group-hover:text-cream/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display mt-8 text-2xl font-extrabold tracking-tight transition-colors group-hover:text-cream">{s.title}</h3>
                  {s.description && <p className="mt-3 leading-relaxed text-muted transition-colors group-hover:text-cream/80">{s.description}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden bg-maroon-deep px-5 py-20 text-cream md:px-8 md:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 size-[560px] rounded-full bg-maroon-2/40 blur-3xl" />
            <div className="absolute -right-32 -bottom-48 size-[520px] rounded-full bg-maroon/60 blur-3xl" />
            <span className="font-display absolute -bottom-24 left-1/2 -translate-x-1/2 text-[22rem] leading-none font-black text-cream/[0.03] select-none">&rdquo;</span>
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

      <CtaBand />
    </>
  );
}
