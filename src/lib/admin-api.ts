import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "./supabase/config";
import type { Project } from "./types";
import { BASE_PATH, slugify } from "./utils";

type Db = SupabaseClient;
export type AdminTable = "projects" | "categories" | "services" | "testimonials" | "enquiries";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
const MAX_VIDEO_BYTES = 5 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm"];

function friendly(error: { code?: string; message: string }) {
  if (error.code === "23505") return "That URL slug is already used by another item.";
  if (error.code === "42501" || /row-level security/i.test(error.message)) return "You don't have permission to do that.";
  return error.message;
}

// ---------- images ----------

export async function uploadImage(db: Db, file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error(`${file.name}: only JPG, PNG, WebP, AVIF or GIF images are allowed.`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name}: images must be under 10 MB.`);
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Uploads a short video clip (MP4/WebM, max 5 MB). */
export async function uploadVideo(db: Db, file: File, folder: string): Promise<string> {
  if (!VIDEO_TYPES.includes(file.type)) throw new Error(`${file.name}: only MP4 or WebM videos are allowed.`);
  if (file.size > MAX_VIDEO_BYTES)
    throw new Error(`${file.name} is ${(file.size / 1048576).toFixed(1)} MB — videos must be 5 MB or less. Export a shorter or smaller clip.`);
  const ext = file.type === "video/webm" ? "webm" : "mp4";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteImages(db: Db, urls: (string | null | undefined)[]) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const paths = urls
    .filter((u): u is string => Boolean(u && u.includes(marker)))
    .map((u) => decodeURIComponent(u.split(marker)[1]));
  if (paths.length) await db.storage.from(MEDIA_BUCKET).remove(paths);
}

// ---------- publishing ----------

/**
 * Asks the host to rebuild the public pages now.
 * Returns true on Vercel/Node hosting (change is live), false on static hosting
 * (GitHub Pages picks the change up on its next scheduled build).
 */
export async function refreshSite(db: Db): Promise<boolean> {
  try {
    const { data } = await db.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return false;
    const res = await fetch(`${BASE_PATH}/api/revalidate`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    return res.ok;
  } catch {
    return false;
  }
}

export function savedMessage(what: string, live: boolean) {
  return live
    ? `${what} — it's live on the website now.`
    : `${what} — it will appear on the website within about 15 minutes.`;
}

// ---------- generic rows ----------

export async function saveRow(db: Db, table: AdminTable, id: string | null, row: Record<string, unknown>) {
  const { data, error } = id
    ? await db.from(table).update(row).eq("id", id).select("id").single()
    : await db.from(table).insert(row).select("id").single();
  if (error) throw new Error(friendly(error));
  return data.id as string;
}

export async function deleteRow(db: Db, table: AdminTable, id: string) {
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) throw new Error(friendly(error));
}

// ---------- form helpers ----------

export const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
export const optional = (fd: FormData, key: string) => text(fd, key) || null;
export const int = (fd: FormData, key: string) => Number.parseInt(text(fd, key), 10) || 0;
export const bool = (fd: FormData, key: string) => fd.get(key) === "on";

// ---------- projects ----------

/** Creates or updates a project from the project form, uploading/removing images. Returns the project id. */
export async function saveProject(db: Db, fd: FormData, existing: Project | null): Promise<string> {
  const title = text(fd, "title");
  if (!title) throw new Error("Title is required.");
  const slug = slugify(text(fd, "slug") || title);

  let cover = existing?.cover_image_url ?? null;
  let gallery = [...(existing?.gallery ?? [])];
  const removed: string[] = [];

  if (bool(fd, "remove_cover") && cover) {
    removed.push(cover);
    cover = null;
  }
  const coverFile = fd.get("cover");
  if (coverFile instanceof File && coverFile.size > 0) {
    if (cover) removed.push(cover);
    cover = await uploadImage(db, coverFile, `projects/${slug}`);
  }

  const removeFromGallery = new Set(fd.getAll("remove_gallery").map(String));
  removed.push(...gallery.filter((g) => removeFromGallery.has(g)));
  gallery = gallery.filter((g) => !removeFromGallery.has(g));
  for (const file of fd.getAll("gallery")) {
    if (file instanceof File && file.size > 0) gallery.push(await uploadImage(db, file, `projects/${slug}`));
  }

  let videos = [...(existing?.videos ?? [])];
  const removeVideos = new Set(fd.getAll("remove_video").map(String));
  removed.push(...videos.filter((v) => removeVideos.has(v)));
  videos = videos.filter((v) => !removeVideos.has(v));
  for (const file of fd.getAll("videos")) {
    if (file instanceof File && file.size > 0) videos.push(await uploadVideo(db, file, `projects/${slug}`));
  }

  let logo = existing?.logo_url ?? null;
  if (bool(fd, "remove_logo") && logo) {
    removed.push(logo);
    logo = null;
  }
  const logoFile = fd.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logo) removed.push(logo);
    logo = await uploadImage(db, logoFile, `logos`);
  }

  const id = await saveRow(db, "projects", existing?.id ?? null, {
    title,
    slug,
    category_id: optional(fd, "category_id"),
    summary: optional(fd, "summary"),
    description: optional(fd, "description"),
    video_url: optional(fd, "video_url"),
    cover_image_url: cover,
    gallery,
    videos,
    logo_url: logo,
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
    sort_order: int(fd, "sort_order"),
  });

  await deleteImages(db, removed);
  return id;
}

export async function deleteProject(db: Db, project: Project) {
  await deleteRow(db, "projects", project.id);
  await deleteImages(db, [project.cover_image_url, project.logo_url, ...(project.gallery ?? []), ...(project.videos ?? [])]);
}

// ---------- account ----------

export async function changePassword(db: Db, email: string, fd: FormData) {
  const current = String(fd.get("current_password") ?? "");
  const next = String(fd.get("new_password") ?? "");
  const confirm = String(fd.get("confirm_password") ?? "");
  if (!current || !next || !confirm) throw new Error("Please fill in all three fields.");
  if (next.length < 8) throw new Error("The new password must be at least 8 characters.");
  if (next !== confirm) throw new Error("The new passwords don't match.");
  if (next === current) throw new Error("The new password must be different from the current one.");

  const { error: authError } = await db.auth.signInWithPassword({ email, password: current });
  if (authError) throw new Error("Your current password is incorrect.");

  const { error } = await db.auth.updateUser({ password: next });
  if (error) {
    throw new Error(
      /weak|pwned|leaked/i.test(error.message)
        ? "That password is too weak or has appeared in a data leak. Please choose a stronger one."
        : error.message,
    );
  }
}
