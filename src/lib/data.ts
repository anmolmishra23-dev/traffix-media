import { cache } from "react";
import { getPublicClient } from "./supabase/public";
import {
  fallbackCategories,
  fallbackProjects,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
  fallbackTeam,
  fallbackAboutSections,
  fallbackHighlights,
} from "./fallback-content";
import type { AboutSection, Category, Highlight, Project, Service, SiteSettings, TeamMember, Testimonial } from "./types";

const PROJECT_SELECT = "*, category:categories(id, name, slug, sort_order)";

/** Industry order first, then the project's own order within its industry. */
const byIndustryThenOrder = (a: Project, b: Project) =>
  (a.category?.sort_order ?? 999) - (b.category?.sort_order ?? 999) || a.sort_order - b.sort_order;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = getPublicClient();
  if (!db) return fallbackSettings;
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings:", error.message);
  return { ...fallbackSettings, ...(data ?? {}) };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = getPublicClient();
  if (!db) return fallbackCategories;
  const { data, error } = await db.from("categories").select("*").order("sort_order").order("name");
  if (error) console.error("getCategories:", error.message);
  return data ?? [];
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const db = getPublicClient();
  if (!db) return fallbackProjects;
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) console.error("getProjects:", error.message);
  return ((data as Project[]) ?? []).sort(byIndustryThenOrder);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const db = getPublicClient();
  if (!db) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) console.error("getProjectBySlug:", error.message);
  return (data as Project) ?? null;
});

export const getServices = cache(async (): Promise<Service[]> => {
  const db = getPublicClient();
  if (!db) return fallbackServices;
  const { data, error } = await db.from("services").select("*").order("sort_order");
  if (error) console.error("getServices:", error.message);
  return data ?? [];
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = getPublicClient();
  if (!db) return fallbackTestimonials;
  const { data, error } = await db
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) console.error("getTestimonials:", error.message);
  return data ?? [];
});

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const db = getPublicClient();
  if (!db) return fallbackTeam;
  const { data, error } = await db.from("team_members").select("*").eq("published", true).order("sort_order");
  if (error) console.error("getTeam:", error.message);
  return data ?? [];
});

export const getAboutSections = cache(async (): Promise<AboutSection[]> => {
  const db = getPublicClient();
  if (!db) return fallbackAboutSections;
  const { data, error } = await db.from("about_sections").select("*").order("sort_order");
  if (error) console.error("getAboutSections:", error.message);
  return data ?? [];
});

export const getHighlights = cache(async (): Promise<Highlight[]> => {
  const db = getPublicClient();
  if (!db) return fallbackHighlights;
  const { data, error } = await db.from("highlights").select("*").order("sort_order");
  if (error) console.error("getHighlights:", error.message);
  return data ?? [];
});

/** Projects grouped under their category, in category order. */
export async function getProjectsByCategory() {
  const [categories, projects] = await Promise.all([getCategories(), getProjects()]);
  return categories
    .map((category) => ({
      category,
      projects: projects.filter((p) => p.category_id === category.id),
    }))
    .filter((g) => g.projects.length > 0);
}
