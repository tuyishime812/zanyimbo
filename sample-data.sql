-- ============================================
-- Sample Data for DGT Sounds Platform
-- Run this in Supabase SQL Editor to populate test content
-- ============================================

-- ============================================
-- 1. Sample Artists
-- ============================================
INSERT INTO artists (name, bio, verified, image_url, created_at)
VALUES 
  ('Sauti Sol', 'Kenyan Afro-pop band from Nairobi, formed in 2005. Known for hits like "Suzanna" and "Melanin". The group consists of Bien-Aimé Baraza, Willis Chimano, Savara Mudigi, and Polycarp Otieno.', true, NULL, NOW()),
  ('Burna Boy', 'Nigerian Afro-fusion singer and songwriter. Grammy Award winner known for "African Giant". One of Africa''s biggest music exports.', true, NULL, NOW()),
  ('Wizkid', 'Nigerian Afrobeats superstar. International hits include "Essence" and "One Dance" with Drake. Multiple BET Awards winner.', true, NULL, NOW()),
  ('Diamond Platnumz', 'Tanzanian Bongo Flava artist and one of East Africa''s biggest music stars. Founder of Wasafi Record label.', true, NULL, NOW()),
  ('Master KG', 'South African musician and producer. Creator of the global hit "Jerusalema" that took the world by storm in 2020.', true, NULL, NOW()),
  ('Nadia Mukami', 'Kenyan singer-songwriter known for contemporary R&B and Afro-pop. One of Kenya''s most talented young artists.', true, NULL, NOW()),
  ('Harmonize', 'Tanzanian Afrobeat artist and former Wasafi Classic Baby member. Known for hits like "Kwangwaru" and "More Time".', true, NULL, NOW()),
  ('Fally Ipupa', 'Congolese R&B and soukous singer, dancer and songwriter. Former member of Koffi Olomide''s Quartier Latin.', true, NULL, NOW()),
  ('Yemi Alade', 'Nigerian Afropop singer known for "Johnny" and powerful performances. One of Africa''s most successful female artists.', true, NULL, NOW()),
  ('Koffi Olomide', 'Congolese soukous legend with over 40 years in music. Multiple Kora Awards winner and music icon.', true, NULL, NOW());

-- ============================================
-- 2. Sample Albums
-- ============================================
INSERT INTO albums (title, artist_id, artist_name, cover_url, release_date, track_count, featured, created_at)
VALUES 
  ('Midnight Train', 
   (SELECT id FROM artists WHERE name = 'Sauti Sol' LIMIT 1),
   'Sauti Sol',
   NULL,
   '2020-10-02',
   0,
   true,
   NOW()),
  
  ('Love, Damini', 
   (SELECT id FROM artists WHERE name = 'Burna Boy' LIMIT 1),
   'Burna Boy',
   NULL,
   '2022-07-08',
   0,
   true,
   NOW()),
  
  ('Made in Lagos', 
   (SELECT id FROM artists WHERE name = 'Wizkid' LIMIT 1),
   'Wizkid',
   NULL,
   '2020-10-30',
   0,
   true,
   NOW()),
  
  ('A Boy from Tandale', 
   (SELECT id FROM artists WHERE name = 'Diamond Platnumz' LIMIT 1),
   'Diamond Platnumz',
   NULL,
   '2022-06-03',
   0,
   true,
   NOW()),
  
  ('Rumbidzai', 
   (SELECT id FROM artists WHERE name = 'Master KG' LIMIT 1),
   'Master KG',
   NULL,
   '2021-09-17',
   0,
   false,
   NOW()),
  
  ('No Filter', 
   (SELECT id FROM artists WHERE name = 'Nadia Mukami' LIMIT 1),
   'Nadia Mukami',
   NULL,
   '2021-11-12',
   0,
   false,
   NOW()),
  
  ('Highly Favoured', 
   (SELECT id FROM artists WHERE name = 'Harmonize' LIMIT 1),
   'Harmonize',
   NULL,
   '2022-08-26',
   0,
   false,
   NOW()),
  
  ('Altecole', 
   (SELECT id FROM artists WHERE name = 'Fally Ipupa' LIMIT 1),
   'Fally Ipupa',
   NULL,
   '2022-06-10',
   0,
   true,
   NOW()),
  
  ('Mama Africa', 
   (SELECT id FROM artists WHERE name = 'Yemi Alade' LIMIT 1),
   'Yemi Alade',
   NULL,
   '2022-09-09',
   0,
   false,
   NOW()),
  
  ('Haute Ecole', 
   (SELECT id FROM artists WHERE name = 'Koffi Olomide' LIMIT 1),
   'Koffi Olomide',
   NULL,
   '2020-12-04',
   0,
   false,
   NOW());

-- ============================================
-- 3. Sample Songs
-- Note: audio_url is NULL - you'll need to upload real audio files via admin panel
-- ============================================
INSERT INTO songs (title, artist_id, artist_name, album_id, album_name, audio_url, cover_url, duration, is_downloadable, featured, play_count, download_count, created_at)
VALUES 
  ('Suzanna', 
   (SELECT id FROM artists WHERE name = 'Sauti Sol' LIMIT 1),
   'Sauti Sol',
   (SELECT id FROM albums WHERE title = 'Midnight Train' LIMIT 1),
   'Midnight Train',
   NULL,
   NULL,
   198,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Melanin', 
   (SELECT id FROM artists WHERE name = 'Sauti Sol' LIMIT 1),
   'Sauti Sol',
   (SELECT id FROM albums WHERE title = 'Midnight Train' LIMIT 1),
   'Midnight Train',
   NULL,
   NULL,
   215,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Last Last', 
   (SELECT id FROM artists WHERE name = 'Burna Boy' LIMIT 1),
   'Burna Boy',
   (SELECT id FROM albums WHERE title = 'Love, Damini' LIMIT 1),
   'Love, Damini',
   NULL,
   NULL,
   162,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('It''s Plenty', 
   (SELECT id FROM artists WHERE name = 'Burna Boy' LIMIT 1),
   'Burna Boy',
   (SELECT id FROM albums WHERE title = 'Love, Damini' LIMIT 1),
   'Love, Damini',
   NULL,
   NULL,
   189,
   true,
   false,
   0,
   0,
   NOW()),
  
  ('Essence', 
   (SELECT id FROM artists WHERE name = 'Wizkid' LIMIT 1),
   'Wizkid',
   (SELECT id FROM albums WHERE title = 'Made in Lagos' LIMIT 1),
   'Made in Lagos',
   NULL,
   NULL,
   244,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Ginger', 
   (SELECT id FROM artists WHERE name = 'Wizkid' LIMIT 1),
   'Wizkid',
   (SELECT id FROM albums WHERE title = 'Made in Lagos' LIMIT 1),
   'Made in Lagos',
   NULL,
   NULL,
   231,
   true,
   false,
   0,
   0,
   NOW()),
  
  ('Penelope', 
   (SELECT id FROM artists WHERE name = 'Diamond Platnumz' LIMIT 1),
   'Diamond Platnumz',
   (SELECT id FROM albums WHERE title = 'A Boy from Tandale' LIMIT 1),
   'A Boy from Tandale',
   NULL,
   NULL,
   189,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Jerusalema', 
   (SELECT id FROM artists WHERE name = 'Master KG' LIMIT 1),
   'Master KG',
   (SELECT id FROM albums WHERE title = 'Rumbidzai' LIMIT 1),
   'Rumbidzai',
   NULL,
   NULL,
   213,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Wangu', 
   (SELECT id FROM artists WHERE name = 'Nadia Mukami' LIMIT 1),
   'Nadia Mukami',
   (SELECT id FROM albums WHERE title = 'No Filter' LIMIT 1),
   'No Filter',
   NULL,
   NULL,
   176,
   true,
   false,
   0,
   0,
   NOW()),
  
  ('More Time', 
   (SELECT id FROM artists WHERE name = 'Harmonize' LIMIT 1),
   'Harmonize',
   (SELECT id FROM albums WHERE title = 'Highly Favoured' LIMIT 1),
   'Highly Favoured',
   NULL,
   NULL,
   201,
   true,
   false,
   0,
   0,
   NOW()),
  
  ('Dancefloor', 
   (SELECT id FROM artists WHERE name = 'Fally Ipupa' LIMIT 1),
   'Fally Ipupa',
   (SELECT id FROM albums WHERE title = 'Altecole' LIMIT 1),
   'Altecole',
   NULL,
   NULL,
   185,
   true,
   false,
   0,
   0,
   NOW()),
  
  ('Johnny', 
   (SELECT id FROM artists WHERE name = 'Yemi Alade' LIMIT 1),
   'Yemi Alade',
   (SELECT id FROM albums WHERE title = 'Mama Africa' LIMIT 1),
   'Mama Africa',
   NULL,
   NULL,
   219,
   true,
   true,
   0,
   0,
   NOW()),
  
  ('Droit Chemin', 
   (SELECT id FROM artists WHERE name = 'Koffi Olomide' LIMIT 1),
   'Koffi Olomide',
   (SELECT id FROM albums WHERE title = 'Haute Ecole' LIMIT 1),
   'Haute Ecole',
   NULL,
   NULL,
   267,
   true,
   false,
   0,
   0,
   NOW());

-- ============================================
-- 4. Sample Genres (if genres table exists)
-- ============================================
INSERT INTO genres (name, created_at)
VALUES 
  ('Afrobeats', NOW()),
  ('Afro-pop', NOW()),
  ('Amapiano', NOW()),
  ('Bongo Flava', NOW()),
  ('Soukous', NOW()),
  ('Afro-fusion', NOW()),
  ('R&B', NOW()),
  ('Hip Hop', NOW()),
  ('Gospel', NOW()),
  ('Traditional', NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Verification Queries
-- Run these to check the inserted data
-- ============================================

-- Check artists count
SELECT COUNT(*) as total_artists FROM artists;

-- Check albums count
SELECT COUNT(*) as total_albums FROM albums;

-- Check songs count
SELECT COUNT(*) as total_songs FROM songs;

-- Check genres count
SELECT COUNT(*) as total_genres FROM genres;

-- View all artists
SELECT name, verified FROM artists ORDER BY name;

-- View all albums with artist names
SELECT title, artist_name, release_date, featured FROM albums ORDER BY release_date DESC;

-- View all songs with artist and album
SELECT 
  s.title as song_title,
  s.artist_name,
  s.album_name,
  s.duration,
  s.featured
FROM songs s
ORDER BY s.created_at DESC;
