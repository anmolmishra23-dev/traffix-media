import type { Metadata } from "next";
import type { Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, HeartBubble, PlayIcon } from "@/components/icons";
import { AutoVideo } from "@/components/site/AutoVideo";
import { CtaBand } from "@/components/site/CtaBand";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { SlideRail } from "@/components/site/SlideRail";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { SITE_NAME, SITE_URL, cn, initials, mediaUrl, posterFor, toEmbedUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/** Full URL for SEO tags (site paths like "/media/x.webp" become absolute). */
const absolute = (src: string) => (src.startsWith("/") ? `${SITE_URL}${src}` : src);

function describe(p: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>) {
  return (
    p.summary ??
    `${p.title} — ${p.category?.name ?? "brand"} work by ${SITE_NAME}, a creative marketing and video production company.`
  );
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = describe(project);
  return {
    title: `${project.title}${project.category ? ` — ${project.category.name}` : ""}`,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${SITE_NAME}`,
      description,
      url: `/work/${project.slug}`,
      ...(project.cover_image_url ? { images: [{ url: absolute(project.cover_image_url) }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const embed = toEmbedUrl(project.video_url);
  const hasMedia = (p: Project) => Boolean(p.cover_image_url || p.videos.length);
  const related = all
    .filter((p) => p.id !== project.id && p.category_id === project.category_id)
    .sort((a, b) => Number(hasMedia(b)) - Number(hasMedia(a)))
    .slice(0, 3);

  // Creatives = cover + gallery (a cover that is only a video poster is not a creative)
  const isPoster = (src: string | null) => Boolean(src && /\/video-\d+\.(webp|jpg)$/.test(src));
  const images = [
    ...(project.cover_image_url && !isPoster(project.cover_image_url) ? [project.cover_image_url] : []),
    ...project.gallery,
  ];
  const videos = project.videos;

  // Next case study (prefer ones that have media)
  const others = all.filter((p) => p.id !== project.id);
  const pos = all.findIndex((p) => p.id === project.id);
  const next =
    [...all.slice(pos + 1), ...all.slice(0, pos)].find((p) => p.cover_image_url || p.videos.length) ?? others[0] ?? null;

  const facts = [
    videos.length > 0 && { value: String(videos.length), label: videos.length === 1 ? "Reel" : "Reels" },
    project.category && { value: project.category.name, label: "Industry", small: true },
  ].filter(Boolean) as { value: string; label: string; small?: boolean }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: describe(project),
    url: `${SITE_URL}/work/${project.slug}`,
    genre: project.category?.name,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(project.cover_image_url ? { image: absolute(project.cover_image_url) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden px-5 pt-8 pb-20 md:px-8 md:pt-12 md:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-8%] size-[640px] rounded-full bg-maroon/[0.08] blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href="/work" className="hover:text-maroon">
                Work
              </Link>
              {project.category && (
                <>
                  <span className="mx-2">/</span>
                  <Link href={`/work#${project.category.slug}`} className="hover:text-maroon">
                    {project.category.name}
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-8 flex items-center gap-4">
              {project.logo_url ? (
                <span className="flex h-20 min-w-20 items-center justify-center rounded-2xl bg-ink px-5">
                  <Image src={mediaUrl(project.logo_url)} alt={`${project.title} logo`} width={200} height={80} className="h-12 w-auto max-w-[170px] object-contain brightness-0 invert" />
                </span>
              ) : (
                <span className="font-display flex size-16 items-center justify-center rounded-2xl bg-ink text-xl font-black text-cream">
                  {initials(project.title)}
                </span>
              )}
              <p className="font-mono text-xs tracking-[0.18em] text-maroon uppercase">Case study</p>
            </div>

            <h1 className="font-display mt-6 text-[clamp(2.6rem,6.2vw,5.6rem)] leading-[0.9] font-black tracking-[-0.03em] text-balance uppercase">
              {project.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl text-pretty">
              {project.summary ??
                `${images.length || videos.length ? "Content we created for" : "Our work with"} ${project.title}${
                  project.category ? ` in ${project.category.name.toLowerCase()}` : ""
                } — designed to stop the scroll and make the brand impossible to ignore.`}
            </p>

            {facts.length > 0 && (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-8">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">{f.label}</dt>
                    <dd className={cn("font-display mt-1 font-black text-maroon", f.small ? "text-xl" : "text-4xl")}>{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              {images.length > 0 && (
                <a href="#creatives" className="group inline-flex items-center gap-3 rounded-full bg-maroon px-7 py-4 font-semibold text-cream transition hover:bg-maroon-deep">
                  See the work <ArrowUpRight className="size-5 rotate-90 transition group-hover:rotate-[135deg]" />
                </a>
              )}
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-4 font-semibold transition hover:border-maroon hover:text-maroon">
                Start a project like this
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <HeroStack project={project} images={images} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Embedded video (YouTube / Vimeo / Instagram link) ---------- */}
      {embed && (
        <section className="px-5 pb-20 md:px-8">
          <div className={cn("mx-auto overflow-hidden rounded-3xl bg-ink", embed.vertical ? "aspect-[9/16] max-w-sm" : "aspect-video max-w-6xl")}>
            <iframe
              src={embed.src}
              title={`${project.title} video`}
              className="h-full w-full"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* ---------- Reels ---------- */}
      {videos.length > 0 && (
        <section className="bg-ink px-5 py-20 text-cream md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-cream/60 uppercase">
                  <span className="size-2 animate-pulse rounded-full bg-[#ff3b3b]" /> Reels
                </p>
                <h2 className="font-display mt-3 text-4xl font-black tracking-tight uppercase md:text-6xl">Made to be watched</h2>
              </div>
              <p className="max-w-sm text-cream/60">Short-form video shot and edited by Traffix Media for {project.title}.</p>
            </Reveal>
            <ul className="mt-14 flex snap-x snap-mandatory justify-start gap-6 overflow-x-auto pb-4 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
              {videos.map((src, i) => (
                <Reveal as="li" key={src} delay={i * 100} className={cn("w-[62vw] max-w-[280px] shrink-0 snap-center sm:w-[240px]", i % 2 === 1 && "md:translate-y-10")}>
                  <Phone>
                    <AutoVideo src={src} poster={posterFor(src)} label={`${project.title} reel ${i + 1}`} />
                  </Phone>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Creatives ---------- */}
      {images.length > 0 && (
        <section id="creatives" className="scroll-mt-20 overflow-hidden bg-cream-2/60 py-20 md:py-28">
          <Reveal className="mx-auto mb-10 flex max-w-7xl flex-col justify-between gap-4 px-5 md:flex-row md:items-end md:px-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">The creatives</p>
              <h2 className="font-display mt-3 text-4xl font-black tracking-tight uppercase md:text-6xl">Posts &amp; carousels</h2>
            </div>
            <p className="max-w-sm text-muted">Swipe through the posts and carousels we designed — tap any one to see it full size.</p>
          </Reveal>
          <div className="mx-auto max-w-[1440px]">
            <SlideRail images={images} title={project.title} />
          </div>
        </section>
      )}

      {/* ---------- About ---------- */}
      {project.description && (
        <section className="px-5 py-20 md:px-8">
          <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
            <h2 className="font-display text-2xl font-extrabold tracking-tight uppercase">About the project</h2>
            <div className="space-y-5 text-lg leading-relaxed text-ink/85">
              {project.description.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ---------- Next project ---------- */}
      {next && (
        <section className="px-5 pt-20 pb-6 md:px-8">
          <Link href={`/work/${next.slug}`} className="group relative mx-auto block max-w-7xl overflow-hidden rounded-[2rem] bg-ink text-cream">
            <div className="absolute inset-0 opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75">
              {next.videos[0] ? (
                <AutoVideo src={next.videos[0]} poster={next.cover_image_url} />
              ) : next.cover_image_url ? (
                <Image src={mediaUrl(next.cover_image_url)} alt="" fill sizes="1280px" className="object-cover" />
              ) : null}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
            <div className="relative flex min-h-[300px] flex-col justify-end p-8 md:min-h-[380px] md:p-14">
              <p className="font-mono text-xs tracking-[0.2em] text-cream/70 uppercase">Next project</p>
              <p className="font-display mt-3 flex items-center gap-5 text-4xl font-black tracking-tight uppercase md:text-7xl">
                {next.title}
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cream text-maroon transition group-hover:rotate-45 md:size-16">
                  <ArrowUpRight className="size-6" />
                </span>
              </p>
              {next.category && <p className="mt-3 text-cream/70">{next.category.name}</p>}
            </div>
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="px-5 pt-14 pb-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">More {project.category?.name}</h2>
              <Link href="/work" className="group hidden items-center gap-2 font-semibold text-maroon sm:inline-flex">
                All work <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <li key={p.id}>
                  <ProjectCard project={p} index={i + 1} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="h-14" />
      <CtaBand />
    </>
  );
}

/** Fanned stack of the project's first creatives (or its reel in a phone) — the hero visual. */
function HeroStack({ project, images }: { project: Project; images: string[] }) {
  const video = project.videos[0];
  const cards = images.slice(0, video ? 2 : 3);

  if (!video && cards.length === 0) {
    return (
      <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[440px] items-end overflow-hidden rounded-[2rem] bg-maroon p-8 text-cream">
        <span aria-hidden="true" className="font-display absolute -right-6 -bottom-10 text-[14rem] leading-none font-black tracking-tighter text-cream/10">
          {initials(project.title)}
        </span>
        <HeartBubble className="animate-float absolute top-8 left-8 size-16 text-cream/90" />
        <p className="font-display relative text-3xl font-extrabold tracking-tight uppercase">Be seen. Be known.</p>
      </div>
    );
  }

  const back = video ? cards : cards.slice(1);
  return (
    <div className="group/stack relative mx-auto aspect-[4/5] w-full max-w-[440px]">
      {back.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-[6%] overflow-hidden rounded-[1.6rem] shadow-2xl shadow-ink/20 transition-transform duration-700",
            i === 0
              ? "-translate-x-[16%] -rotate-[9deg] group-hover/stack:-translate-x-[24%] group-hover/stack:-rotate-[13deg]"
              : "translate-x-[16%] rotate-[8deg] group-hover/stack:translate-x-[24%] group-hover/stack:rotate-[12deg]",
          )}
        >
          <Image src={mediaUrl(src)} alt="" fill sizes="400px" className="object-cover" />
        </div>
      ))}
      <div className="absolute inset-[3%] z-10">
        {video ? (
          <div className="mx-auto w-[55%]">
            <Phone>
              <AutoVideo src={video} poster={project.cover_image_url} label={`${project.title} reel`} />
            </Phone>
          </div>
        ) : (
          <div className="relative h-full overflow-hidden rounded-[1.6rem] shadow-2xl shadow-maroon/30 ring-1 ring-ink/5">
            <Image
              src={mediaUrl(cards[0])}
              alt={`${project.title} — ${project.category?.name ?? "project"} by Traffix Media`}
              fill
              priority
              sizes="440px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      {video && (
        <span className="absolute right-[4%] bottom-[8%] z-20 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-maroon shadow-lg">
          <PlayIcon className="size-3" /> Reel
        </span>
      )}
    </div>
  );
}

/** Phone frame for vertical video. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.2rem] border-[6px] border-[#141012] bg-black shadow-2xl shadow-black/40">
      <span aria-hidden="true" className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#141012]" />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
