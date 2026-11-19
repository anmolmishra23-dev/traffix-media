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

-- About page, highlights and team
update public.site_settings set about_heading = 'Good Content Builds Brands. Great Content Moves Them Forward.', about_body = 'Traffix Media started with an idea back in 2022, long before it officially became a company in 2026. What began as a vision gradually turned into years of planning, learning, working on projects and building something we genuinely wanted to bring into the industry.

The idea behind Traffix Media was simple: we felt that Indian brands and businesses had much more potential than what they were showing through their content and advertising.

The world of content is changing rapidly. International brands are setting new standards in filmmaking, advertising, storytelling and digital communication. We believe Indian brands should have the same opportunities, quality and creative approach. We want to be a part of bringing that change.

Today, content is much more than just posting on Instagram or making a promotional video. It has become one of the most important ways for a business to connect with its customers, build trust and grow. We started Traffix Media to help businesses understand and make the most of that opportunity.', about_closing = 'Traffix Media. Creating with purpose. Growing with brands.', highlights_heading = 'The work speaks', highlights_intro = 'We take client relationships and the quality of our work seriously. Every project is an opportunity to build trust and deliver something that makes a difference.' where id = 1;
insert into public.about_sections (title, body, sort_order) select * from (values
  ('What we do differently', 'We don''t believe that every brand should have the same kind of content.

A fashion brand, a real estate company, a restaurant and a manufacturing business all have different audiences and different things to communicate. So why should their content look the same?

Before creating anything, we try to understand the brand, its audience, its market and what it actually wants to achieve. Based on that, we work on the creative direction, production and marketing strategy.

Our work ranges from social media content and brand films to television commercials, product shoots, promotional campaigns and performance-driven video advertisements.

For us, a video shouldn''t just look good. It should have a reason to exist and should contribute something to the brand.', 1),
  ('Why Traffix Media', 'We started Traffix Media because we wanted to build something that goes beyond the usual agency model.

We wanted to bring production and marketing closer together, so that creativity and business objectives work hand in hand. A beautifully shot video is valuable, but when the right idea reaches the right audience and brings actual results, that''s where its real value lies.

We want to help brands present themselves better, reach the people who matter to them and build a stronger position in their respective industries.

Every brand has a different story to tell. Our job is to understand it and make sure the right people see it.', 2),
  ('Where we want to go', 'Our vision is bigger than creating campaigns for individual brands.

We want to contribute to raising the standard of Indian content and advertising. We want to see Indian production, storytelling and creative work standing confidently alongside international work.

We know it takes time, consistency and a lot of good work to get there. That''s exactly what we''re building towards.', 3)
) as v(title, body, sort_order) where not exists (select 1 from public.about_sections);
insert into public.highlights (value, label, description, sort_order) select * from (values
  ('95%+', 'Client satisfaction rate', 'A track record built on positive client experiences and long-term relationships.', 1),
  ('90%+', 'Clients reporting better ROI', 'More than 90% of our served clients have experienced improvements in their return on investment over time.', 2),
  ('Client-first', 'Approach', 'We focus on understanding the requirement before deciding what needs to be created.', 3)
) as v(value, label, description, sort_order) where not exists (select 1 from public.highlights);
insert into public.team_members (name, role, photo_url, sort_order) select * from (values
  ('Abhinav Thakur', 'CEO & Founder', '/media/team/abhinav.webp', 1),
  ('Nishchay', 'Operations Head & Co-founder', '/media/team/nishchay.webp', 2),
  ('Ishant', 'Content Head & Co-founder', '/media/team/ishant.webp', 3)
) as v(name, role, photo_url, sort_order) where not exists (select 1 from public.team_members);

-- Behind-the-scenes clips (public/media/bts) and hover media for services
update public.site_settings set hero_videos = '{/media/bts/08.mp4,/media/bts/28.mp4,/media/bts/07.mp4,/media/bts/24.mp4,/media/bts/05.mp4,/media/bts/26.mp4,/media/bts/20.mp4,/media/bts/02.mp4,/media/bts/29.mp4,/media/bts/22.mp4}' where id = 1;
update public.services set media = '{/media/bts/28.mp4,/media/bts/25.mp4,/media/bts/05.mp4,/media/bts/02.mp4}' where title = 'Video Production';
update public.services set media = '{/media/bts/06.mp4,/media/projects/time-of-magazine-rearco/04.webp,/media/bts/11.mp4,/media/projects/time-of-magazine-rearco/15.webp,/media/bts/09.mp4,/media/projects/time-of-magazine-rearco/20.webp}' where title = 'Photo Shoots';
update public.services set media = '{/media/projects/kalcend-ai/video-2.mp4,/media/projects/sanmati-jewellers/video-3.mp4,/media/projects/grand-buses-india/video-1.mp4,/media/bts/27.mp4}' where title = 'Social Media Management';
update public.services set media = '{/media/projects/kalcend-ai/video-1.mp4,/media/bts/19.mp4,/media/projects/kalcend-ai/video-3.mp4,/media/bts/30.mp4}' where title = 'Influencer Marketing';
update public.services set media = '{/media/bts/10.mp4,/media/projects/time-of-magazine-rearco/video-1.mp4,/media/bts/16.mp4,/media/bts/17.mp4}' where title = 'Event Coverage';
update public.services set media = '{/media/bts/03.mp4,/media/projects/green-vidyut/video-1.mp4,/media/bts/01.mp4,/media/projects/amalfi-infrastructures/video-1.mp4}' where title = 'Brand Campaigns';
update public.services set media = '{/media/projects/fllexibott/01.webp,/media/projects/eattaley-cafe/01.webp,/media/projects/grand-buses-india/01.webp,/media/projects/fllexibott/06.webp}' where title = 'Performance Marketing';
-- home-page camera: Amalfi later in the loop, Sanmati and Green Vidyut out
update public.projects set hero_order = null;
update public.projects set hero_order = 1 where slug = 'grand-buses-india';
update public.projects set hero_order = 2 where slug = 'kalcend-ai';
update public.projects set hero_order = 3 where slug = 'time-of-magazine-rearco';
update public.projects set hero_order = 4 where slug = 'fllexibott';
update public.projects set hero_order = 5 where slug = 'eattaley-cafe';
update public.projects set hero_order = 6 where slug = 'amalfi-infrastructures';
-- team: Ishant in the centre, Nishchay on the right
update public.team_members set sort_order = 1 where name = 'Abhinav Thakur';
update public.team_members set sort_order = 2 where name = 'Ishant';
update public.team_members set sort_order = 3 where name = 'Nishchay';

-- Client round 2: new covers, Grand Buses shows a photo (not its video) on cards, Prateek Group media from its shoots
update public.projects set cover_image_url = '/media/projects/grand-buses-india/16.webp',
  gallery = array_replace(gallery, '/media/projects/grand-buses-india/16.webp', '/media/projects/grand-buses-india/01.webp'),
  card_video = false
  where slug = 'grand-buses-india' and cover_image_url = '/media/projects/grand-buses-india/01.webp';
update public.projects set cover_image_url = '/media/projects/eattaley-cafe/11.webp',
  gallery = array_replace(gallery, '/media/projects/eattaley-cafe/11.webp', '/media/projects/eattaley-cafe/01.webp')
  where slug = 'eattaley-cafe' and cover_image_url = '/media/projects/eattaley-cafe/01.webp';
update public.projects set cover_image_url = '/media/projects/prateek-group/01.webp',
  videos = '{/media/projects/prateek-group/video-1.mp4,/media/projects/prateek-group/video-2.mp4,/media/projects/prateek-group/video-3.mp4,/media/projects/prateek-group/video-4.mp4}'
  where slug = 'prateek-group' and cover_image_url is null and videos = '{}';
