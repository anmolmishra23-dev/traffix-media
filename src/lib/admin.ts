import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getServerClient } from "./supabase/server";
import { MEDIA_BUCKET } from "./supabase/config";

/**
 * Returns a Supabase client for a logged-in admin, or redirects to the login page.
 * Cached per request so the layout and page share one auth check.
 */
export const requireAdmin = cache(async () => {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");

  return { supabase, user };
});

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** Uploads an image to the public media bucket and returns its public URL (or null if no file). */
export async function uploadImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  file: FormDataEntryValue | null,
  folder: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error(`${file.name}: only JPG, PNG, WebP, AVIF or GIF images are allowed.`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name}: images must be under 10 MB.`);

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Deletes previously uploaded images (ignores URLs that are not in our bucket). */
export async function deleteImages(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  urls: (string | null | undefined)[],
) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const paths = urls
    .filter((u): u is string => Boolean(u && u.includes(marker)))
    .map((u) => decodeURIComponent(u.split(marker)[1]));
  if (paths.length) await supabase.storage.from(MEDIA_BUCKET).remove(paths);
}
