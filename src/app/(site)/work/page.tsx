import type { Metadata } from "next";
import { CtaBand } from "@/components/site/CtaBand";
import { Reveal } from "@/components/site/Reveal";
import { WorkGrid } from "@/components/site/WorkGrid";
import { getCategories, getProjects, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Campaigns, content and influencer marketing by Traffix Media for brands in real estate, events, lifestyle, F&B, technology, fitness and more.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const [categories, projects, settings] = await Promise.all([getCategories(), getProjects(), getSettings()]);

  return (
    <>
      <section className="px-5 pt-10 pb-24 md:px-8 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-maroon uppercase">Portfolio</p>
            <h1 className="font-display mt-4 text-[clamp(3rem,8vw,7rem)] leading-[0.88] font-black tracking-[-0.03em] uppercase">
              Our work
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              {settings.stat_brands || `${projects.length}+`} brands across {settings.stat_industries || `${categories.length}+`} industries. Pick an
              industry or browse everything.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <WorkGrid categories={categories} projects={projects} />
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
