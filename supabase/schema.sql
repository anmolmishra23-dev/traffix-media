-- =============================================================
-- Traffix Media — database schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query
-- Then run seed.sql, then add your admin email (see bottom).
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  category_id      uuid references public.categories(id) on delete set null,
  summary          text,
  description      text,
  cover_image_url  text,
  video_url        text,
  gallery          text[] not null default '{}',
  videos           text[] not null default '{}',   -- uploaded video files (mp4/webm), max 5 MB each
  logo_url         text,                            -- brand logo (shown in the client strip)
  featured         boolean not null default false,
  hero_order       int,                             -- position in the home-page viewfinder (empty = not shown)
  published        boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
-- for databases created before these columns existed
alter table public.projects add column if not exists videos text[] not null default '{}';
alter table public.projects add column if not exists logo_url text;
alter table public.projects add column if not exists hero_order int;
create index if not exists projects_category_idx on public.projects(category_id);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  media       text[] not null default '{}',   -- photos/videos that play behind the tile on hover
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.services add column if not exists media text[] not null default '{}';

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  company     text,
  quote       text not null,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 200),
  phone       text check (char_length(phone) <= 40),
  company     text check (char_length(company) <= 160),
  service     text check (char_length(service) <= 120),
  budget      text check (char_length(budget) <= 60),
  message     text not null check (char_length(message) between 1 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Single-row table for editable site-wide text and contact details
create table if not exists public.site_settings (
  id               int primary key default 1 check (id = 1),
  tagline          text,
  hero_heading     text,
  hero_subheading  text,
  about_heading    text,
  about_body       text,
  email            text,
  phone            text,
  instagram        text,
  whatsapp         text,
  location         text,
  stat_brands      text default '50+',
  stat_industries  text default '10+',
  showreel_videos  text[] not null default '{}',     -- short loops used as section backgrounds
  updated_at       timestamptz not null default now()
);
alter table public.site_settings add column if not exists stat_brands text default '50+';
alter table public.site_settings add column if not exists stat_industries text default '10+';
alter table public.site_settings add column if not exists showreel_videos text[] not null default '{}';
alter table public.site_settings add column if not exists hero_videos text[] not null default '{}';   -- moving wall behind the home/about heroes

-- Emails allowed into /admin
create table if not exists public.admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ---------- Helpers ----------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------- Row Level Security ----------

alter table public.categories    enable row level security;
alter table public.projects      enable row level security;
alter table public.services      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.enquiries     enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users   enable row level security;

-- Public read
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (published or public.is_admin());

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select using (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (published or public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);

-- Anyone can submit the contact form; only admins can read it
drop policy if exists "public submit enquiry" on public.enquiries;
create policy "public submit enquiry" on public.enquiries for insert with check (is_read = false);

drop policy if exists "admin read enquiries" on public.enquiries;
create policy "admin read enquiries" on public.enquiries for select using (public.is_admin());

-- Admin write access
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write services" on public.services;
create policy "admin write services" on public.services for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin update enquiries" on public.enquiries;
create policy "admin update enquiries" on public.enquiries for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete enquiries" on public.enquiries;
create policy "admin delete enquiries" on public.enquiries for delete using (public.is_admin());

drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin read admins" on public.admin_users;
create policy "admin read admins" on public.admin_users for select using (public.is_admin());

-- ---------- Grants (Data API access; RLS above still applies) ----------

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.projects, public.services,
               public.testimonials, public.site_settings to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, insert, update, delete on public.categories, public.projects,
               public.services, public.testimonials, public.enquiries to authenticated;
grant update on public.site_settings to authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Storage bucket for uploaded images ----------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------- About page, team, testimonial links ----------
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  photo_url   text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
create table if not exists public.about_sections (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create table if not exists public.highlights (
  id          uuid primary key default gen_random_uuid(),
  value       text not null,
  label       text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.testimonials add column if not exists project_id uuid references public.projects(id) on delete set null;
alter table public.site_settings add column if not exists about_closing text;
alter table public.site_settings add column if not exists highlights_heading text;
alter table public.site_settings add column if not exists highlights_intro text;

alter table public.team_members   enable row level security;
alter table public.about_sections enable row level security;
alter table public.highlights     enable row level security;

drop policy if exists "public read team" on public.team_members;
create policy "public read team" on public.team_members for select using (published or public.is_admin());
drop policy if exists "admin write team" on public.team_members;
create policy "admin write team" on public.team_members for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read about" on public.about_sections;
create policy "public read about" on public.about_sections for select using (true);
drop policy if exists "admin write about" on public.about_sections;
create policy "admin write about" on public.about_sections for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read highlights" on public.highlights;
create policy "public read highlights" on public.highlights for select using (true);
drop policy if exists "admin write highlights" on public.highlights;
create policy "admin write highlights" on public.highlights for all using (public.is_admin()) with check (public.is_admin());

grant select on public.team_members, public.about_sections, public.highlights to anon, authenticated;
grant insert, update, delete on public.team_members, public.about_sections, public.highlights to authenticated;

-- ---------- Add the client's admin login ----------
-- 1. Supabase Dashboard → Authentication → Users → Add user (email + password)
-- 2. Then run (with their real email):
-- insert into public.admin_users (email) values ('traffixmediacontact@gmail.com');
