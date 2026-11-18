export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  summary: string | null;
  description: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  gallery: string[];
  videos: string[];
  logo_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  category?: (Pick<Category, "id" | "name" | "slug"> & { sort_order?: number }) | null;
};

export type Service = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  published: boolean;
  sort_order: number;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = {
  tagline: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  about_heading: string | null;
  about_body: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  whatsapp: string | null;
  location: string | null;
  stat_brands: string | null;
  stat_industries: string | null;
  showreel_videos: string[];
};
