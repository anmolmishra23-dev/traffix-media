-- =============================================================
-- Traffix Media — starting content (run after schema.sql)
-- Everything here can be edited later from /admin.
-- =============================================================

insert into public.site_settings (id, tagline, hero_heading, hero_subheading, about_heading, about_body, email, phone, instagram, whatsapp, location)
values (
  1,
  'Be Seen. Be Known.',
  'Your brand is worth millions. Why does your content look ordinary?',
  'Traffix Media is a creative marketing and video production company helping brands across real estate, hospitality, lifestyle, technology and more get noticed — and remembered.',
  'We make brands impossible to scroll past.',
  'From launch campaigns for real estate developers to influencer drives for consumer brands and full event coverage, Traffix Media plans, produces and distributes content that earns attention. We work across industries, but the goal is always the same: get your brand seen by the right people, and make sure they remember it.',
  'traffixmediacontact@gmail.com',
  '+91 82878 18962',
  'traffix_media',
  '918287818962',
  null
)
on conflict (id) do nothing;

insert into public.categories (name, slug, sort_order) values
  ('Real Estate',              'real-estate',           1),
  ('Transportation',           'transportation',        2),
  ('Products & Lifestyle',     'products-lifestyle',    3),
  ('Energy & Sustainability',  'energy-sustainability', 4),
  ('Technology & AI',          'technology-ai',         5),
  ('Events & Experiences',     'events-experiences',    6),
  ('Food & Beverage',          'food-beverage',         7),
  ('Influencer Marketing',     'influencer-marketing',  8),
  ('Entertainment & Media',    'entertainment-media',   9),
  ('Fitness & Wellness',       'fitness-wellness',      10)
on conflict (slug) do nothing;

insert into public.projects (title, slug, category_id, featured, sort_order)
select v.title, v.slug, c.id, v.featured, v.sort_order
from (values
  ('Shobha Adani',                              'shobha-adani',                          'real-estate',           false, 1),
  ('Amalfi Infrastructures',                    'amalfi-infrastructures',                'real-estate',           false, 2),
  ('Prateek Group',                             'prateek-group',                         'real-estate',           true,  3),
  ('Rearco',                                    'rearco',                                'real-estate',           false, 4),
  ('Grand Buses India',                         'grand-buses-india',                     'transportation',        false, 1),
  ('Velvet',                                    'velvet',                                'transportation',        false, 2),
  ('Fllexibott',                                'fllexibott',                            'products-lifestyle',    false, 1),
  ('Sanmati Jewellers',                         'sanmati-jewellers',                     'products-lifestyle',    false, 2),
  ('Tanhera',                                   'tanhera',                               'products-lifestyle',    false, 3),
  ('Green Vidyut',                              'green-vidyut',                          'energy-sustainability', false, 1),
  ('Kalcend AI',                                'kalcend-ai',                            'technology-ai',         true,  1),
  ('Grand Hyatt',                               'grand-hyatt',                           'events-experiences',    true,  1),
  ('Time of Magazine (Rearco)',                 'time-of-magazine-rearco',               'events-experiences',    false, 2),
  ('Sanskritya — Sufi Night, Bharat Mandapam',  'sanskritya-sufi-night-bharat-mandapam', 'events-experiences',    true,  3),
  ('DLF — The Aureva',                          'dlf-the-aureva',                        'events-experiences',    true,  4),
  ('Eattaley Cafe',                             'eattaley-cafe',                         'food-beverage',         false, 1),
  ('Zomato',                                    'zomato',                                'influencer-marketing',  true,  1),
  ('Minimalist',                                'minimalist',                            'influencer-marketing',  false, 2),
  ('Coffeeza',                                  'coffeeza',                              'influencer-marketing',  false, 3),
  ('Mamaearth',                                 'mamaearth',                             'influencer-marketing',  true,  4),
  ('The Raconteur Magazine',                    'the-raconteur-magazine',                'entertainment-media',   false, 1),
  ('Shadow Box',                                'shadow-box',                            'fitness-wellness',      false, 1)
) as v(title, slug, category_slug, featured, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- Placeholder services — confirm the real list with the client and edit in /admin/services
insert into public.services (title, description, sort_order)
select * from (values
  ('Video Production',        'Brand films, ad films, reels and event videos — from concept and shoot to final edit.', 1),
  ('Photo Shoots',            'Product, jewellery, fashion and food shoots — styled, lit and retouched for campaigns, catalogues and social.', 2),
  ('Social Media Management', 'Strategy, content calendars, posting and community management across Instagram, Facebook, LinkedIn and YouTube.', 3),
  ('Influencer Marketing',    'Finding the right creators, managing collaborations and tracking results for campaigns that feel native.', 4),
  ('Event Coverage',          'Photo, video and live social coverage that turns a one-night event into weeks of content.', 5),
  ('Brand Campaigns',         'Launch and awareness campaigns built around a clear idea, from concept to rollout.', 6),
  ('Performance Marketing',   'Paid social campaigns on Meta and Google, optimised for reach, leads and sales.', 7)
) as v(title, description, sort_order)
where not exists (select 1 from public.services);


-- Client media (files live in public/media as WebP / MP4; paths are stored here)
update public.projects set cover_image_url = '/media/projects/amalfi-infrastructures/video-1.webp', gallery = '{}', videos = '{/media/projects/amalfi-infrastructures/video-1.mp4}', logo_url = null where slug = 'amalfi-infrastructures';
update public.projects set cover_image_url = '/media/projects/eattaley-cafe/01.webp', gallery = '{/media/projects/eattaley-cafe/02.webp,/media/projects/eattaley-cafe/03.webp,/media/projects/eattaley-cafe/04.webp,/media/projects/eattaley-cafe/05.webp,/media/projects/eattaley-cafe/06.webp,/media/projects/eattaley-cafe/07.webp,/media/projects/eattaley-cafe/08.webp,/media/projects/eattaley-cafe/09.webp,/media/projects/eattaley-cafe/10.webp,/media/projects/eattaley-cafe/11.webp,/media/projects/eattaley-cafe/12.webp,/media/projects/eattaley-cafe/13.webp}', videos = '{}', logo_url = '/media/logos/eattaley-cafe.png' where slug = 'eattaley-cafe';
update public.projects set cover_image_url = '/media/projects/fllexibott/01.webp', gallery = '{/media/projects/fllexibott/02.webp,/media/projects/fllexibott/03.webp,/media/projects/fllexibott/04.webp,/media/projects/fllexibott/05.webp,/media/projects/fllexibott/06.webp,/media/projects/fllexibott/07.webp,/media/projects/fllexibott/08.webp,/media/projects/fllexibott/09.webp,/media/projects/fllexibott/10.webp,/media/projects/fllexibott/11.webp,/media/projects/fllexibott/12.webp,/media/projects/fllexibott/13.webp,/media/projects/fllexibott/14.webp,/media/projects/fllexibott/15.webp,/media/projects/fllexibott/16.webp,/media/projects/fllexibott/17.webp,/media/projects/fllexibott/18.webp,/media/projects/fllexibott/19.webp,/media/projects/fllexibott/20.webp,/media/projects/fllexibott/21.webp,/media/projects/fllexibott/22.webp,/media/projects/fllexibott/23.webp}', videos = '{}', logo_url = '/media/logos/fllexibott.png' where slug = 'fllexibott';
update public.projects set cover_image_url = '/media/projects/grand-buses-india/01.webp', gallery = '{/media/projects/grand-buses-india/02.webp,/media/projects/grand-buses-india/03.webp,/media/projects/grand-buses-india/04.webp,/media/projects/grand-buses-india/05.webp,/media/projects/grand-buses-india/06.webp,/media/projects/grand-buses-india/07.webp,/media/projects/grand-buses-india/08.webp,/media/projects/grand-buses-india/09.webp,/media/projects/grand-buses-india/10.webp,/media/projects/grand-buses-india/11.webp,/media/projects/grand-buses-india/12.webp,/media/projects/grand-buses-india/13.webp,/media/projects/grand-buses-india/14.webp,/media/projects/grand-buses-india/15.webp,/media/projects/grand-buses-india/16.webp,/media/projects/grand-buses-india/17.webp,/media/projects/grand-buses-india/18.webp,/media/projects/grand-buses-india/19.webp,/media/projects/grand-buses-india/20.webp,/media/projects/grand-buses-india/21.webp,/media/projects/grand-buses-india/22.webp,/media/projects/grand-buses-india/23.webp,/media/projects/grand-buses-india/24.webp,/media/projects/grand-buses-india/25.webp,/media/projects/grand-buses-india/26.webp,/media/projects/grand-buses-india/27.webp,/media/projects/grand-buses-india/28.webp,/media/projects/grand-buses-india/29.webp,/media/projects/grand-buses-india/30.webp}', videos = '{/media/projects/grand-buses-india/video-1.mp4}', logo_url = '/media/logos/grand-buses-india.png' where slug = 'grand-buses-india';
update public.projects set cover_image_url = '/media/projects/green-vidyut/video-1.webp', gallery = '{}', videos = '{/media/projects/green-vidyut/video-1.mp4}', logo_url = null where slug = 'green-vidyut';
update public.projects set cover_image_url = '/media/projects/kalcend-ai/video-1.webp', gallery = '{}', videos = '{/media/projects/kalcend-ai/video-1.mp4,/media/projects/kalcend-ai/video-2.mp4,/media/projects/kalcend-ai/video-3.mp4}', logo_url = null where slug = 'kalcend-ai';
update public.projects set cover_image_url = '/media/projects/rearco/01.webp', gallery = '{/media/projects/rearco/02.webp,/media/projects/rearco/03.webp,/media/projects/rearco/04.webp,/media/projects/rearco/05.webp,/media/projects/rearco/06.webp,/media/projects/rearco/07.webp,/media/projects/rearco/08.webp,/media/projects/rearco/09.webp,/media/projects/rearco/10.webp,/media/projects/rearco/11.webp,/media/projects/rearco/12.webp,/media/projects/rearco/13.webp,/media/projects/rearco/14.webp,/media/projects/rearco/15.webp}', videos = '{/media/projects/rearco/video-1.mp4,/media/projects/rearco/video-2.mp4,/media/projects/rearco/video-3.mp4}', logo_url = '/media/logos/rearco.png' where slug = 'rearco';
update public.projects set cover_image_url = '/media/projects/sanmati-jewellers/01.webp', gallery = '{/media/projects/sanmati-jewellers/02.webp,/media/projects/sanmati-jewellers/03.webp,/media/projects/sanmati-jewellers/04.webp,/media/projects/sanmati-jewellers/05.webp,/media/projects/sanmati-jewellers/06.webp,/media/projects/sanmati-jewellers/07.webp,/media/projects/sanmati-jewellers/08.webp,/media/projects/sanmati-jewellers/09.webp,/media/projects/sanmati-jewellers/10.webp,/media/projects/sanmati-jewellers/11.webp,/media/projects/sanmati-jewellers/12.webp,/media/projects/sanmati-jewellers/13.webp,/media/projects/sanmati-jewellers/14.webp,/media/projects/sanmati-jewellers/15.webp,/media/projects/sanmati-jewellers/16.webp,/media/projects/sanmati-jewellers/17.webp,/media/projects/sanmati-jewellers/18.webp,/media/projects/sanmati-jewellers/19.webp,/media/projects/sanmati-jewellers/20.webp,/media/projects/sanmati-jewellers/21.webp,/media/projects/sanmati-jewellers/22.webp,/media/projects/sanmati-jewellers/23.webp,/media/projects/sanmati-jewellers/24.webp,/media/projects/sanmati-jewellers/25.webp,/media/projects/sanmati-jewellers/26.webp,/media/projects/sanmati-jewellers/27.webp,/media/projects/sanmati-jewellers/28.webp,/media/projects/sanmati-jewellers/29.webp,/media/projects/sanmati-jewellers/30.webp,/media/projects/sanmati-jewellers/31.webp,/media/projects/sanmati-jewellers/32.webp,/media/projects/sanmati-jewellers/33.webp,/media/projects/sanmati-jewellers/34.webp,/media/projects/sanmati-jewellers/35.webp,/media/projects/sanmati-jewellers/36.webp,/media/projects/sanmati-jewellers/37.webp,/media/projects/sanmati-jewellers/38.webp,/media/projects/sanmati-jewellers/39.webp,/media/projects/sanmati-jewellers/40.webp,/media/projects/sanmati-jewellers/41.webp,/media/projects/sanmati-jewellers/42.webp,/media/projects/sanmati-jewellers/43.webp,/media/projects/sanmati-jewellers/44.webp,/media/projects/sanmati-jewellers/45.webp,/media/projects/sanmati-jewellers/46.webp,/media/projects/sanmati-jewellers/47.webp,/media/projects/sanmati-jewellers/48.webp,/media/projects/sanmati-jewellers/49.webp,/media/projects/sanmati-jewellers/50.webp,/media/projects/sanmati-jewellers/51.webp,/media/projects/sanmati-jewellers/52.webp,/media/projects/sanmati-jewellers/53.webp,/media/projects/sanmati-jewellers/54.webp,/media/projects/sanmati-jewellers/55.webp,/media/projects/sanmati-jewellers/56.webp,/media/projects/sanmati-jewellers/57.webp,/media/projects/sanmati-jewellers/58.webp,/media/projects/sanmati-jewellers/59.webp,/media/projects/sanmati-jewellers/60.webp,/media/projects/sanmati-jewellers/61.webp,/media/projects/sanmati-jewellers/62.webp,/media/projects/sanmati-jewellers/63.webp,/media/projects/sanmati-jewellers/64.webp,/media/projects/sanmati-jewellers/65.webp,/media/projects/sanmati-jewellers/66.webp,/media/projects/sanmati-jewellers/67.webp,/media/projects/sanmati-jewellers/68.webp}', videos = '{/media/projects/sanmati-jewellers/video-2.mp4,/media/projects/sanmati-jewellers/video-3.mp4,/media/projects/sanmati-jewellers/video-1.mp4}', logo_url = '/media/logos/sanmati-jewellers.png' where slug = 'sanmati-jewellers';
update public.projects set cover_image_url = '/media/projects/the-raconteur-magazine/01.webp', gallery = '{/media/projects/the-raconteur-magazine/02.webp,/media/projects/the-raconteur-magazine/03.webp,/media/projects/the-raconteur-magazine/04.webp,/media/projects/the-raconteur-magazine/05.webp,/media/projects/the-raconteur-magazine/06.webp,/media/projects/the-raconteur-magazine/07.webp,/media/projects/the-raconteur-magazine/08.webp,/media/projects/the-raconteur-magazine/09.webp,/media/projects/the-raconteur-magazine/10.webp,/media/projects/the-raconteur-magazine/11.webp,/media/projects/the-raconteur-magazine/12.webp,/media/projects/the-raconteur-magazine/13.webp,/media/projects/the-raconteur-magazine/14.webp,/media/projects/the-raconteur-magazine/15.webp,/media/projects/the-raconteur-magazine/16.webp,/media/projects/the-raconteur-magazine/17.webp,/media/projects/the-raconteur-magazine/18.webp,/media/projects/the-raconteur-magazine/19.webp,/media/projects/the-raconteur-magazine/20.webp,/media/projects/the-raconteur-magazine/21.webp,/media/projects/the-raconteur-magazine/22.webp,/media/projects/the-raconteur-magazine/23.webp}', videos = '{}', logo_url = '/media/logos/the-raconteur-magazine.png' where slug = 'the-raconteur-magazine';
update public.projects set cover_image_url = '/media/projects/time-of-magazine-rearco/01.webp', gallery = '{/media/projects/time-of-magazine-rearco/02.webp,/media/projects/time-of-magazine-rearco/03.webp,/media/projects/time-of-magazine-rearco/04.webp,/media/projects/time-of-magazine-rearco/05.webp,/media/projects/time-of-magazine-rearco/06.webp,/media/projects/time-of-magazine-rearco/07.webp,/media/projects/time-of-magazine-rearco/08.webp,/media/projects/time-of-magazine-rearco/09.webp,/media/projects/time-of-magazine-rearco/10.webp,/media/projects/time-of-magazine-rearco/11.webp,/media/projects/time-of-magazine-rearco/12.webp,/media/projects/time-of-magazine-rearco/13.webp,/media/projects/time-of-magazine-rearco/14.webp,/media/projects/time-of-magazine-rearco/15.webp,/media/projects/time-of-magazine-rearco/16.webp,/media/projects/time-of-magazine-rearco/17.webp,/media/projects/time-of-magazine-rearco/18.webp,/media/projects/time-of-magazine-rearco/19.webp,/media/projects/time-of-magazine-rearco/20.webp,/media/projects/time-of-magazine-rearco/21.webp,/media/projects/time-of-magazine-rearco/22.webp,/media/projects/time-of-magazine-rearco/23.webp,/media/projects/time-of-magazine-rearco/24.webp,/media/projects/time-of-magazine-rearco/25.webp,/media/projects/time-of-magazine-rearco/26.webp,/media/projects/time-of-magazine-rearco/27.webp,/media/projects/time-of-magazine-rearco/28.webp,/media/projects/time-of-magazine-rearco/29.webp,/media/projects/time-of-magazine-rearco/30.webp,/media/projects/time-of-magazine-rearco/31.webp,/media/projects/time-of-magazine-rearco/32.webp,/media/projects/time-of-magazine-rearco/33.webp,/media/projects/time-of-magazine-rearco/34.webp,/media/projects/time-of-magazine-rearco/35.webp,/media/projects/time-of-magazine-rearco/36.webp,/media/projects/time-of-magazine-rearco/37.webp,/media/projects/time-of-magazine-rearco/38.webp,/media/projects/time-of-magazine-rearco/39.webp}', videos = '{/media/projects/time-of-magazine-rearco/video-1.mp4,/media/projects/time-of-magazine-rearco/video-2.mp4,/media/projects/time-of-magazine-rearco/video-3.mp4}', logo_url = null where slug = 'time-of-magazine-rearco';
update public.projects set featured = (slug in ('amalfi-infrastructures','eattaley-cafe','fllexibott','grand-buses-india','green-vidyut','kalcend-ai','rearco','sanmati-jewellers','time-of-magazine-rearco'));
update public.site_settings set stat_brands = '50+', stat_industries = '10+', showreel_videos = '{/media/showreel/1.mp4,/media/showreel/2.mp4,/media/showreel/3.mp4,/media/showreel/4.mp4}' where id = 1;
