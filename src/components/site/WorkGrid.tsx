"use client";

import { useSyncExternalStore } from "react";
import type { Category, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

// All projects are rendered in the HTML (good for SEO); the filter only hides/shows them.
export function WorkGrid({ categories, projects }: { categories: Category[]; projects: Project[] }) {
  // The selected industry lives in the URL hash (/work#real-estate) so it can be linked to.
  const hash = useSyncExternalStore(subscribe, () => window.location.hash.slice(1), () => "");
  const active = categories.some((c) => c.slug === hash) ? hash : "all";

  const select = (slug: string) => {
    history.replaceState(null, "", slug === "all" ? window.location.pathname : `#${slug}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const used = categories.filter((c) => projects.some((p) => p.category_id === c.id));

  return (
    <div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Filter by industry">
        {[{ slug: "all", name: "All work" }, ...used].map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={active === c.slug}
            onClick={() => select(c.slug)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition",
              active === c.slug
                ? "border-maroon bg-maroon text-cream"
                : "border-line bg-transparent text-ink/75 hover:border-maroon hover:text-maroon",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const visible = active === "all" || p.category?.slug === active;
          return (
            <li key={p.id} className={cn(!visible && "hidden")}>
              <ProjectCard project={p} index={i} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
