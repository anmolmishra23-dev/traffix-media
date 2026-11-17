"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImages, requireAdmin, uploadImage } from "@/lib/admin";
import { getServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

// ---------- helpers ----------

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const optional = (fd: FormData, key: string) => text(fd, key) || null;
const int = (fd: FormData, key: string) => Number.parseInt(text(fd, key), 10) || 0;
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

/** Rebuild every public page so changes appear on the live site right away. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function back(path: string, message: string, kind: "ok" | "error" = "ok"): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}${kind}=${encodeURIComponent(message)}`);
}

// ---------- auth ----------

export type LoginState = { error?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await getServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }
  redirect("/admin");
}

export type PasswordState = { error?: string; ok?: boolean };

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const { supabase, user } = await requireAdmin();
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (!current || !next || !confirm) return { error: "Please fill in all three fields." };
  if (next.length < 8) return { error: "The new password must be at least 8 characters." };
  if (next !== confirm) return { error: "The new passwords don't match." };
  if (next === current) return { error: "The new password must be different from the current one." };

  // Confirm the current password before allowing the change (also refreshes the session,
  // which Supabase may require for password changes).
  const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email!, password: current });
  if (authError) return { error: "Your current password is incorrect." };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    const msg = /weak|pwned|leaked/i.test(error.message)
      ? "That password is too weak or has appeared in a data leak. Please choose a stronger one."
      : error.message;
    return { error: msg };
  }
  return { ok: true };
}

export async function signOut() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- projects ----------

export async function saveProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optional(formData, "id");
  const title = text(formData, "title");
  const returnTo = id ? `/admin/projects/${id}` : "/admin/projects/new";
  if (!title) back(returnTo, "Title is required.", "error");

  const slug = slugify(text(formData, "slug") || title);
  let existing: { cover_image_url: string | null; gallery: string[] } | null = null;
  if (id) {
    const { data } = await supabase.from("projects").select("cover_image_url, gallery").eq("id", id).single();
    existing = data;
  }

  let cover = existing?.cover_image_url ?? null;
  let gallery: string[] = existing?.gallery ?? [];
  const removedImages: string[] = [];

  try {
    if (bool(formData, "remove_cover") && cover) {
      removedImages.push(cover);
      cover = null;
    }
    const newCover = await uploadImage(supabase, formData.get("cover"), `projects/${slug}`);
    if (newCover) {
      if (cover) removedImages.push(cover);
      cover = newCover;
    }

    const removeFromGallery = new Set(formData.getAll("remove_gallery").map(String));
    removedImages.push(...gallery.filter((g) => removeFromGallery.has(g)));
    gallery = gallery.filter((g) => !removeFromGallery.has(g));
    for (const file of formData.getAll("gallery")) {
      const url = await uploadImage(supabase, file, `projects/${slug}`);
      if (url) gallery.push(url);
    }
  } catch (e) {
    back(returnTo, (e as Error).message, "error");
  }

  const row = {
    title,
    slug,
    category_id: optional(formData, "category_id"),
    summary: optional(formData, "summary"),
    description: optional(formData, "description"),
    video_url: optional(formData, "video_url"),
    cover_image_url: cover,
    gallery,
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    sort_order: int(formData, "sort_order"),
  };

  const { data, error } = id
    ? await supabase.from("projects").update(row).eq("id", id).select("id").single()
    : await supabase.from("projects").insert(row).select("id").single();

  if (error) {
    const msg = error.code === "23505" ? "Another project already uses this URL slug." : error.message;
    back(returnTo, msg, "error");
  }

  await deleteImages(supabase, removedImages);
  refreshSite();
  back(`/admin/projects/${data!.id}`, id ? "Project saved." : "Project created.");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const { data } = await supabase.from("projects").select("cover_image_url, gallery").eq("id", id).single();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) back(`/admin/projects/${id}`, error.message, "error");
  if (data) await deleteImages(supabase, [data.cover_image_url, ...(data.gallery ?? [])]);
  refreshSite();
  back("/admin/projects", "Project deleted.");
}

// ---------- categories ----------

export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optional(formData, "id");
  const name = text(formData, "name");
  if (!name) back("/admin/categories", "Name is required.", "error");
  const row = { name, slug: slugify(text(formData, "slug") || name), sort_order: int(formData, "sort_order") };
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) back("/admin/categories", error.code === "23505" ? "That slug is already used." : error.message, "error");
  refreshSite();
  back("/admin/categories", id ? "Industry saved." : "Industry added.");
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", text(formData, "id"));
  if (error) back("/admin/categories", error.message, "error");
  refreshSite();
  back("/admin/categories", "Industry deleted. Its projects are now uncategorised.");
}

// ---------- services ----------

export async function saveService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optional(formData, "id");
  const title = text(formData, "title");
  if (!title) back("/admin/services", "Title is required.", "error");
  const row = { title, description: optional(formData, "description"), sort_order: int(formData, "sort_order") };
  const { error } = id
    ? await supabase.from("services").update(row).eq("id", id)
    : await supabase.from("services").insert(row);
  if (error) back("/admin/services", error.message, "error");
  refreshSite();
  back("/admin/services", id ? "Service saved." : "Service added.");
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("services").delete().eq("id", text(formData, "id"));
  if (error) back("/admin/services", error.message, "error");
  refreshSite();
  back("/admin/services", "Service deleted.");
}

// ---------- testimonials ----------

export async function saveTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = optional(formData, "id");
  const name = text(formData, "name");
  const quote = text(formData, "quote");
  if (!name || !quote) back("/admin/testimonials", "Name and quote are required.", "error");
  const row = {
    name,
    quote,
    role: optional(formData, "role"),
    company: optional(formData, "company"),
    published: bool(formData, "published"),
    sort_order: int(formData, "sort_order"),
  };
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) back("/admin/testimonials", error.message, "error");
  refreshSite();
  back("/admin/testimonials", id ? "Testimonial saved." : "Testimonial added.");
}

export async function deleteTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", text(formData, "id"));
  if (error) back("/admin/testimonials", error.message, "error");
  refreshSite();
  back("/admin/testimonials", "Testimonial deleted.");
}

// ---------- enquiries ----------

export async function toggleEnquiryRead(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("enquiries")
    .update({ is_read: text(formData, "is_read") !== "true" })
    .eq("id", text(formData, "id"));
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("enquiries").delete().eq("id", text(formData, "id"));
  if (error) back("/admin/enquiries", error.message, "error");
  back("/admin/enquiries", "Enquiry deleted.");
}

// ---------- settings ----------

export async function saveSettings(formData: FormData) {
  const { supabase } = await requireAdmin();
  const fields = [
    "tagline",
    "hero_heading",
    "hero_subheading",
    "about_heading",
    "about_body",
    "email",
    "phone",
    "instagram",
    "whatsapp",
    "location",
  ] as const;
  const row = Object.fromEntries(fields.map((f) => [f, optional(formData, f)]));
  if (row.instagram) row.instagram = row.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  if (row.whatsapp) row.whatsapp = row.whatsapp.replace(/\D/g, "");

  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) back("/admin/settings", error.message, "error");
  refreshSite();
  back("/admin/settings", "Settings saved.");
}
