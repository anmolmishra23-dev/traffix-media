export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://traffixmedia.in").replace(/\/$/, "");
export const SITE_NAME = "Traffix Media";

/** Prefix for files in /public when the site is served from a sub-path (e.g. GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** Media stored in the database is either a full URL (Supabase upload) or a site path like "/media/x.webp". */
export const mediaUrl = (src: string) => (src.startsWith("/") ? asset(src) : src);

/** Poster frame for a video shipped with the site ("/media/…/video-1.mp4" → "…/video-1.webp"). */
export const posterFor = (videoSrc: string) => (videoSrc.startsWith("/") ? videoSrc.replace(/\.(mp4|webm)$/, ".webp") : null);

/** The picture that represents a project: its cover, else the first gallery image, else its first video's poster. */
export const coverOf = (p: { cover_image_url: string | null; gallery?: string[]; videos?: string[] }) =>
  p.cover_image_url ?? p.gallery?.[0] ?? (p.videos?.[0] ? posterFor(p.videos[0]) : null) ?? null;

export const isVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src);

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "Sanskritya — Sufi Night" → "SS", "Grand Hyatt" → "GH" */
export function initials(name: string) {
  const words = name.replace(/[—()\-]/g, " ").split(/\s+/).filter(Boolean);
  return (words[0]?.[0] ?? "").concat(words[1]?.[0] ?? "").toUpperCase();
}

export function instagramUrl(handle: string | null) {
  if (!handle) return null;
  return `https://www.instagram.com/${handle.replace(/^@/, "")}`;
}

export function whatsappUrl(number: string | null) {
  if (!number) return null;
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

export function telUrl(phone: string | null) {
  if (!phone) return null;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Turns a YouTube, Vimeo or Instagram link into an embeddable URL. */
export function toEmbedUrl(url: string | null): { src: string; vertical: boolean } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return { src: `https://www.youtube.com/embed/${u.pathname.slice(1)}`, vertical: false };
    if (host.endsWith("youtube.com")) {
      const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shorts) return { src: `https://www.youtube.com/embed/${shorts[1]}`, vertical: true };
      const id = u.searchParams.get("v");
      if (id) return { src: `https://www.youtube.com/embed/${id}`, vertical: false };
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return { src: `https://player.vimeo.com/video/${id}`, vertical: false };
    }
    if (host.endsWith("instagram.com")) {
      const m = u.pathname.match(/^\/(reel|reels|p|tv)\/([\w-]+)/);
      if (m) return { src: `https://www.instagram.com/${m[1] === "reels" ? "reel" : m[1]}/${m[2]}/embed`, vertical: true };
    }
  } catch {
    return null;
  }
  return null;
}
