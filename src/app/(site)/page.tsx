import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChatBubble, HeartBubble } from "@/components/icons";
import { CtaBand } from "@/components/site/CtaBand";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { getProjects, getProjectsByCategory, getServices, getSettings, getTestimonials } from "@/lib/data";
import { SITE_NAME, SITE_URL, asset, instagramUrl } from "@/lib/utils";

export default async function HomePage() {
  const [settings, projects, groups, services, testimonials] = await Promise.all([
    getSettings(),
    getProjects(),
    getProjectsByCategory(),
    getServices(),
    getTestimonials(),
  ]);

  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 6);
  const [first, ...rest] = (settings.hero_heading ?? "Be seen. Be known.").split(/(?<=\.)\s+/);

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
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/50 px-4 py-1.5 text-sm font-medium text-muted">
                <span className="size-2 rounded-full bg-maroon" /> Social media &amp; content marketing agency
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-7 text-[clamp(3.1rem,7.4vw,6.6rem)] leading-[0.88] font-black tracking-[-0.035em] uppercase">
                <span className="block text-maroon">{first}</span>
                {rest.length > 0 && <span className="block">{rest.join(" ")}</span>}
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

          <Reveal delay={200} className="relative mx-auto w-full max-w-[460px]">
            <div className="relative aspect-square">
              <div className="absolute inset-[6%] rounded-full bg-maroon/10 blur-3xl" />
              <Image
                src={asset("/brand/logo-circle.png")}
                alt="Traffix Media logo — Be Seen. Be Known."
                width={512}
                height={512}
                priority
                className="relative h-full w-full drop-shadow-[0_30px_60px_rgba(106,26,35,0.25)]"
              />
              <HeartBubble className="animate-float absolute -top-2 left-2 size-16 text-maroon md:size-20 [--r:-10deg]" />
              <div className="absolute -bottom-4 left-0 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-maroon/10">
                <p className="font-display text-3xl font-black text-maroon">{projects.length}+</p>
                <p className="text-sm text-muted">brands served</p>
              </div>
              <div className="absolute top-8 -right-2 rounded-2xl bg-ink px-5 py-4 text-cream shadow-xl md:-right-6">
                <p className="font-display text-3xl font-black">{groups.length}</p>
                <p className="text-sm text-cream/70">industries</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Client marquee ---------- */}
      <section aria-label="Brands we have worked with" className="overflow-hidden border-y border-maroon-deep bg-maroon py-5 text-cream">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {projects.map((p) => (
                <li key={p.id} className="flex items-center">
                  <span className="font-display px-6 text-2xl font-extrabold tracking-tight whitespace-nowrap uppercase md:text-3xl">
                    {p.title}
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
                {groups.length} industries.
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
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-cream/10 py-6 transition hover:bg-cream/[0.03] md:grid-cols-[5rem_1.1fr_1.6fr_auto] md:py-8"
                >
                  <span className="font-display text-sm font-bold text-cream/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl font-extrabold tracking-tight uppercase transition group-hover:translate-x-2 group-hover:text-[#e7a3ab] md:text-4xl">
                    {category.name}
                  </span>
                  <span className="col-span-2 col-start-2 text-cream/55 md:col-span-1 md:col-start-auto">
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
            <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal as="li" key={s.id} delay={(i % 3) * 80} className="group bg-cream p-8 transition hover:bg-white md:p-10">
                  <span className="font-display text-sm font-bold text-maroon">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display mt-8 text-2xl font-extrabold tracking-tight">{s.title}</h3>
                  {s.description && <p className="mt-3 leading-relaxed text-muted">{s.description}</p>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="bg-cream-2 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">Kind words</p>
              <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-tight uppercase md:text-6xl">
                What clients say
              </h2>
            </Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal as="li" key={t.id} delay={(i % 3) * 80} className="flex flex-col rounded-3xl bg-cream p-8">
                  <ChatBubble className="size-10 text-maroon" />
                  <blockquote className="mt-6 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
                  <p className="mt-6 font-semibold">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                  )}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
