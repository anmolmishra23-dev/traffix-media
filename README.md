# Traffix Media — website

Next.js 16 (App Router) + Tailwind CSS v4 + Supabase.

- **Public site:** Home, Work (filter by industry), a page for each project, About, Contact. Pages are pre-rendered as static HTML for SEO and refreshed whenever content changes.
- **Admin panel at `/admin`** (runs in the browser, works on GitHub Pages and Vercel): the client edits projects (images, video links), industries, services, testimonials, site text and contact details, and reads contact-form enquiries.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The site runs **without Supabase** and shows the built-in starting content (`src/lib/fallback-content.ts`). You need Supabase for the admin panel and the contact form.

## Connect Supabase (one-time)

1. Create a free project at https://supabase.com.
2. **Create the admin login:** Authentication → Users → *Add user* (email + password, tick "Auto Confirm User").
3. **Create the tables and content:** put your database password in `DATABASE_URL` in `.env.local`, then run
   ```bash
   npm run db:setup -- admin@example.com
   ```
   (Alternatively, paste `supabase/schema.sql` then `supabase/seed.sql` into the SQL Editor and add the admin with
   `insert into public.admin_users (email) values ('admin@example.com');`.)
4. **Turn off public sign-ups:** Authentication → Sign In / Providers → disable "Allow new users to sign up".
5. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API keys; the anon / publishable key)
   - `NEXT_PUBLIC_SITE_URL`: `https://traffixmedia.in` on the live site (use your localhost address for local development)
6. Restart `npm run dev` and open `/admin`.

### Security model
- Visitors can only **read** published content and **submit** the contact form (Row Level Security in `schema.sql`).
- Only emails listed in `admin_users` can change content, upload images or read enquiries. Other logged-in users get no access.
- The admin talks to Supabase directly from the browser with the public anon key; all permissions are enforced by these database rules.
- Uploaded images go to the public `media` storage bucket.

## Deploy

### GitHub Pages (temporary, static)

`.github/workflows/pages.yml` builds the site (including `/admin`) as static HTML and publishes it on every push, every 15 minutes, and on demand (Actions → *Deploy to GitHub Pages* → *Run workflow*).

One-time setup in the GitHub repo:
1. **Settings → Pages → Source:** GitHub Actions
2. **Settings → Secrets and variables → Actions:** add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

On GitHub Pages, changes saved in the admin go live with the next build (within ~15 minutes, or click *Run workflow*), and images are not resized automatically. On Vercel, changes are live within seconds (the admin calls `/api/revalidate` after each save).

### Vercel / Netlify (full site)

Works on any host that runs Next.js (Vercel, Netlify). Add the three environment variables in the host's dashboard, then point the domain's DNS at the host.

> Vercel's free Hobby plan is for non-commercial use. For a client's business site, use Vercel Pro or Netlify's free tier.

## Where things live

| What | Where |
|---|---|
| Pages | `src/app/(site)/…` |
| Admin pages | `src/app/admin/…` (browser-only) |
| Admin save/delete/upload logic | `src/lib/admin-api.ts` |
| Data fetching | `src/lib/data.ts` |
| Brand colours and fonts | `src/app/globals.css` (`@theme`), `src/app/layout.tsx` |
| Logo files | `public/brand/` |
| SEO | `metadata` in each page, `src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` |
