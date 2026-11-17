import { cache } from "react";
import { getPublicClient } from "./supabase/public";
import {
  fallbackCategories,
  fallbackProjects,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from "./fallback-content";
import type { Category, Project, Service, SiteSettings, Testimonial } from "./types";

const PROJECT_SELECT = "*, category:categories(id, name, slug)";

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
  return (data as Project[]) ?? [];
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
