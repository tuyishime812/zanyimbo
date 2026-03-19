-- ============================================
-- DGT SOUNDS - Fix ALL RLS Policies
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Fix ARTISTS Table RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON artists;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON artists;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON artists;
DROP POLICY IF EXISTS "Enable read access for all users" ON artists;
DROP POLICY IF EXISTS "Public read" ON artists;
DROP POLICY IF EXISTS "Authenticated insert" ON artists;
DROP POLICY IF EXISTS "Authenticated update" ON artists;
DROP POLICY IF EXISTS "Authenticated delete" ON artists;

-- Create new policies for artists
CREATE POLICY "artists_public_read"
ON artists FOR SELECT
TO public
USING (true);

CREATE POLICY "artists_authenticated_insert"
ON artists FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "artists_authenticated_update"
ON artists FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "artists_authenticated_delete"
ON artists FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 2: Fix ALBUMS Table RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON albums;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON albums;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON albums;
DROP POLICY IF EXISTS "Enable read access for all users" ON albums;
DROP POLICY IF EXISTS "Public read" ON albums;
DROP POLICY IF EXISTS "Authenticated insert" ON albums;
DROP POLICY IF EXISTS "Authenticated update" ON albums;
DROP POLICY IF EXISTS "Authenticated delete" ON albums;

-- Create new policies for albums
CREATE POLICY "albums_public_read"
ON albums FOR SELECT
TO public
USING (true);

CREATE POLICY "albums_authenticated_insert"
ON albums FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "albums_authenticated_update"
ON albums FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "albums_authenticated_delete"
ON albums FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 3: Fix SONGS Table RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON songs;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON songs;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON songs;
DROP POLICY IF EXISTS "Enable read access for all users" ON songs;
DROP POLICY IF EXISTS "Public read" ON songs;
DROP POLICY IF EXISTS "Authenticated insert" ON songs;
DROP POLICY IF EXISTS "Authenticated update" ON songs;
DROP POLICY IF EXISTS "Authenticated delete" ON songs;

-- Create new policies for songs
CREATE POLICY "songs_public_read"
ON songs FOR SELECT
TO public
USING (true);

CREATE POLICY "songs_authenticated_insert"
ON songs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "songs_authenticated_update"
ON songs FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "songs_authenticated_delete"
ON songs FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 4: Fix GENRES Table RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON genres;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON genres;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON genres;
DROP POLICY IF EXISTS "Enable read access for all users" ON genres;

-- Create new policies for genres
CREATE POLICY "genres_public_read"
ON genres FOR SELECT
TO public
USING (true);

CREATE POLICY "genres_authenticated_insert"
ON genres FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "genres_authenticated_update"
ON genres FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "genres_authenticated_delete"
ON genres FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 5: Fix SONG_GENRES Table RLS
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON song_genres;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON song_genres;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON song_genres;
DROP POLICY IF EXISTS "Enable read access for all users" ON song_genres;

-- Create new policies for song_genres
CREATE POLICY "song_genres_public_read"
ON song_genres FOR SELECT
TO public
USING (true);

CREATE POLICY "song_genres_authenticated_insert"
ON song_genres FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "song_genres_authenticated_update"
ON song_genres FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "song_genres_authenticated_delete"
ON song_genres FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 6: Verify All Policies
-- ============================================

SELECT 
  tablename as table_name,
  policyname as policy_name,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
  AND (tablename IN ('artists', 'albums', 'songs', 'genres', 'song_genres'))
ORDER BY tablename, policyname;

-- ============================================
-- STEP 7: Enable RLS on All Tables
-- ============================================

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_genres ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DONE! ✅
-- 
-- All RLS policies fixed for:
-- - artists (4 policies)
-- - albums (4 policies)
-- - songs (4 policies)
-- - genres (4 policies)
-- - song_genres (4 policies)
--
-- Now you can upload songs! 🎵
-- ============================================
