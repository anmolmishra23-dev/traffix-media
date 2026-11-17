-- =============================================================
-- Traffix Media — starting content (run after schema.sql)
-- Everything here can be edited later from /admin.
-- =============================================================

insert into public.site_settings (id, tagline, hero_heading, hero_subheading, about_heading, about_body, email, phone, instagram, whatsapp, location)
values (
  1,
  'Be Seen. Be Known.',
  'Be seen. Be known.',
  'Traffix Media is a social media and content marketing agency helping brands across real estate, hospitality, lifestyle, technology and more get noticed — and remembered.',
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
  ('Social Media Management', 'Strategy, content calendars, posting and community management across Instagram, Facebook, LinkedIn and YouTube.', 1),
  ('Influencer Marketing',    'Finding the right creators, managing collaborations and tracking results for campaigns that feel native.', 2),
  ('Content Production',      'Reels, product shoots, brand films and short-form video made for the feed.', 3),
  ('Event Coverage',          'Photo, video and live social coverage that turns a one-night event into weeks of content.', 4),
  ('Brand Campaigns',         'Launch and awareness campaigns built around a clear idea, from concept to rollout.', 5),
  ('Performance Marketing',   'Paid social campaigns on Meta and Google, optimised for reach, leads and sales.', 6)
) as v(title, description, sort_order)
where not exists (select 1 from public.services);
