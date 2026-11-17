import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { getProjects, getProjectsByCategory, getServices, getSettings } from "@/lib/data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "About",
    description: settings.about_body?.slice(0, 155) ?? "About Traffix Media.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [settings, projects, groups, services] = await Promise.all([
    getSettings(),
    getProjects(),
    getProjectsByCategory(),
    getServices(),
  ]);

  const stats = [
    { value: `${projects.length}+`, label: "Brands served" },
    { value: String(groups.length), label: "Industries" },
    { value: String(services.length), label: "Core services" },
  ];

  return (
    <>
      <section className="px-5 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">About Traffix Media</p>
            <h1 className="font-display mt-4 max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9] font-black tracking-[-0.03em] text-balance uppercase">
              {settings.about_heading}
            </h1>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_1.2fr]">
            <Reveal className="relative mx-auto w-full max-w-md">
              <div className="rounded-[2rem] bg-maroon p-10">
                <Image src="/brand/logo-circle.png" alt="Traffix Media" width={512} height={512} className="w-full" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-6 text-xl leading-relaxed text-ink/85 text-pretty">
                {(settings.about_body ?? "").split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-10">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-sm text-muted">{s.label}</dt>
                    <dd className="font-display mt-1 text-4xl font-black text-maroon md:text-5xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-cream md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">Brands that trust us</h2>
          </Reveal>
          <ul className="mt-10 flex flex-wrap gap-3">
            {projects.map((p) => (
              <li key={p.id} className="rounded-full border border-cream/15 px-5 py-2.5 text-cream/80">
                {p.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="h-20 md:h-28" />
      <CtaBand />
    </>
  );
}
