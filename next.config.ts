import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds plain HTML files for static hosting (GitHub Pages).
// BASE_PATH is the sub-folder the site is served from, e.g. "/traffix-media" (empty with a custom domain).
// See .github/workflows/pages.yml. Leave both unset for Vercel / any Node host.
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport ? (process.env.BASE_PATH ?? "").replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Static hosting has no image optimizer, so images are served as uploaded.
    unoptimized: isStaticExport,
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    serverActions: {
      // Admin image uploads go through Server Actions
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
