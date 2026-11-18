import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, HeartBubble } from "@/components/icons";
import { CtaBand } from "@/components/site/CtaBand";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal } from "@/components/site/Reveal";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { SITE_NAME, SITE_URL, cn, initials, mediaUrl, toEmbedUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/** Full URL for SEO tags (site paths like "/media/x.jpg" become absolute). */
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
  const related = all.filter((p) => p.id !== project.id && p.category_id === project.category_id).slice(0, 3);
  const more = related.length ? related : all.filter((p) => p.id !== project.id).slice(0, 3);

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

      <article className="px-5 pt-8 pb-20 md:px-8 md:pt-14">
        <div className="mx-auto max-w-7xl">
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
            <h1 className="font-display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.9] font-black tracking-[-0.03em] text-balance uppercase">
              {project.title}
            </h1>
            {project.category && (
              <p className="mt-6 inline-flex rounded-full bg-maroon px-4 py-1.5 text-sm font-semibold text-cream">
                {project.category.name}
              </p>
            )}
            {project.summary && <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted text-pretty">{project.summary}</p>}
          </Reveal>

          {/* Media */}
          <Reveal delay={120} className="mt-12">
            {embed ? (
              <div
                className={cn(
                  "overflow-hidden rounded-3xl bg-ink",
                  embed.vertical ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video",
                )}
              >
                <iframe
                  src={embed.src}
                  title={`${project.title} video`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : project.cover_image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
                <Image
                  src={mediaUrl(project.cover_image_url)}
                  alt={`${project.title} — ${project.category?.name ?? "project"} by Traffix Media`}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative flex aspect-[16/9] items-end overflow-hidden rounded-3xl bg-maroon p-8 text-cream md:p-12">
                <span
                  aria-hidden="true"
                  className="font-display absolute -right-6 -bottom-16 text-[18rem] leading-none font-black tracking-tighter text-cream/10 md:text-[26rem]"
                >
                  {initials(project.title)}
                </span>
                <HeartBubble className="animate-float absolute top-8 left-8 size-14 text-cream/90 md:size-20" />
                <p className="font-display relative max-w-xl text-2xl font-extrabold tracking-tight uppercase md:text-4xl">
                  Be seen. Be known.
                </p>
              </div>
            )}
          </Reveal>

          {project.description && (
            <Reveal className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
              <h2 className="font-display text-2xl font-extrabold tracking-tight uppercase">About the project</h2>
              <div className="space-y-5 text-lg leading-relaxed text-ink/85">
                {project.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          )}

          {project.videos.length > 0 && (
            <ul className={cn("mt-16 grid grid-cols-1 gap-5", project.videos.length > 1 && "sm:grid-cols-2")}>
              {project.videos.map((src, i) => (
                <Reveal as="li" key={src} delay={(i % 2) * 80} className="overflow-hidden rounded-2xl bg-ink">
                  <video
                    src={`${mediaUrl(src)}#t=0.1`}
                    controls
                    playsInline
                    preload="metadata"
                    className="max-h-[80vh] w-full"
                    aria-label={`${project.title} — video ${i + 1}`}
                  />
                </Reveal>
              ))}
            </ul>
          )}

          {project.gallery.length > 0 && (
            <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {project.gallery.map((src, i) => (
                <Reveal as="li" key={src} delay={(i % 2) * 80} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-2">
                  <Image
                    src={mediaUrl(src)}
                    alt={`${project.title} — image ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section className="px-5 pb-24 md:px-8">
          <div className="mx-auto max-w-7xl border-t border-line pt-16">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">
                {related.length ? `More ${project.category?.name ?? ""}` : "More work"}
              </h2>
              <Link href="/work" className="group hidden items-center gap-2 font-semibold text-maroon sm:inline-flex">
                All work <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p, i) => (
                <li key={p.id}>
                  <ProjectCard project={p} index={i + 1} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
