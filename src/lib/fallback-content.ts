// Content used when Supabase is not connected yet (local development / preview).
// Mirrors supabase/seed.sql so the site looks the same before and after connecting.
import type { Category, Project, Service, SiteSettings, Testimonial } from "./types";

export const fallbackSettings: SiteSettings = {
  tagline: "Be Seen. Be Known.",
  hero_heading: "Your brand is worth millions. Why does your content look ordinary?",
  hero_subheading:
    "Traffix Media is a creative marketing and video production company helping brands across real estate, hospitality, lifestyle, technology and more get noticed — and remembered.",
  about_heading: "We make brands impossible to scroll past.",
  about_body:
    "From launch campaigns for real estate developers to influencer drives for consumer brands and full event coverage, Traffix Media plans, produces and distributes content that earns attention. We work across industries, but the goal is always the same: get your brand seen by the right people, and make sure they remember it.",
  email: "traffixmediacontact@gmail.com",
  phone: "+91 82878 18962",
  instagram: "traffix_media",
  whatsapp: "918287818962",
  location: null,
  stat_brands: "50+",
  stat_industries: "10+",
  showreel_videos: [],
};

const categoryList: [string, string][] = [
  ["Real Estate", "real-estate"],
  ["Transportation", "transportation"],
  ["Products & Lifestyle", "products-lifestyle"],
  ["Energy & Sustainability", "energy-sustainability"],
  ["Technology & AI", "technology-ai"],
  ["Events & Experiences", "events-experiences"],
  ["Food & Beverage", "food-beverage"],
  ["Influencer Marketing", "influencer-marketing"],
  ["Entertainment & Media", "entertainment-media"],
  ["Fitness & Wellness", "fitness-wellness"],
];

export const fallbackCategories: Category[] = categoryList.map(([name, slug], i) => ({
  id: `cat-${slug}`,
  name,
  slug,
  sort_order: i + 1,
}));

const projectList: [string, string, string, boolean][] = [
  ["Shobha Adani", "shobha-adani", "real-estate", false],
  ["Amalfi Infrastructures", "amalfi-infrastructures", "real-estate", false],
  ["Prateek Group", "prateek-group", "real-estate", true],
  ["Rearco", "rearco", "real-estate", false],
  ["Grand Buses India", "grand-buses-india", "transportation", false],
  ["Velvet", "velvet", "transportation", false],
  ["Fllexibott", "fllexibott", "products-lifestyle", false],
  ["Sanmati Jewellers", "sanmati-jewellers", "products-lifestyle", false],
  ["Tanhera", "tanhera", "products-lifestyle", false],
  ["Green Vidyut", "green-vidyut", "energy-sustainability", false],
  ["Kalcend AI", "kalcend-ai", "technology-ai", true],
  ["Grand Hyatt", "grand-hyatt", "events-experiences", true],
  ["Time of Magazine (Rearco)", "time-of-magazine-rearco", "events-experiences", false],
  ["Sanskritya — Sufi Night, Bharat Mandapam", "sanskritya-sufi-night-bharat-mandapam", "events-experiences", true],
  ["DLF — The Aureva", "dlf-the-aureva", "events-experiences", true],
  ["Eattaley Cafe", "eattaley-cafe", "food-beverage", false],
  ["Zomato", "zomato", "influencer-marketing", true],
  ["Minimalist", "minimalist", "influencer-marketing", false],
  ["Coffeeza", "coffeeza", "influencer-marketing", false],
  ["Mamaearth", "mamaearth", "influencer-marketing", true],
  ["The Raconteur Magazine", "the-raconteur-magazine", "entertainment-media", false],
  ["Shadow Box", "shadow-box", "fitness-wellness", false],
];

export const fallbackProjects: Project[] = projectList.map(([title, slug, catSlug, featured], i) => {
  const cat = fallbackCategories.find((c) => c.slug === catSlug)!;
  return {
    id: `proj-${slug}`,
    title,
    slug,
    category_id: cat.id,
    summary: null,
    description: null,
    cover_image_url: null,
    video_url: null,
    gallery: [],
    videos: [],
    logo_url: null,
    featured,
    published: true,
    sort_order: i,
    category: { id: cat.id, name: cat.name, slug: cat.slug },
  };
});

export const fallbackServices: Service[] = [
  ["Video Production", "Brand films, ad films, reels and event videos — from concept and shoot to final edit."],
  ["Photo Shoots", "Product, jewellery, fashion and food shoots — styled, lit and retouched for campaigns, catalogues and social."],
  ["Social Media Management", "Strategy, content calendars, posting and community management across Instagram, Facebook, LinkedIn and YouTube."],
  ["Influencer Marketing", "Finding the right creators, managing collaborations and tracking results for campaigns that feel native."],
  ["Event Coverage", "Photo, video and live social coverage that turns a one-night event into weeks of content."],
  ["Brand Campaigns", "Launch and awareness campaigns built around a clear idea, from concept to rollout."],
  ["Performance Marketing", "Paid social campaigns on Meta and Google, optimised for reach, leads and sales."],
].map(([title, description], i) => ({ id: `svc-${i}`, title, description, sort_order: i + 1 }));

export const fallbackTestimonials: Testimonial[] = [];
