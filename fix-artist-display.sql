-- ============================================
-- DGT SOUNDS - Fix Artist Display Issue
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Check Current Songs Data
-- ============================================
SELECT 
  s.id,
  s.title,
  s.artist_id,
  a.id as artist_id_check,
  a.name as artist_name_check
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id
LIMIT 10;

-- ============================================
-- STEP 2: Verify Artist Relationship
-- ============================================
SELECT 
  s.id,
  s.title,
  a.name as artist_name
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id
ORDER BY s.created_at DESC
LIMIT 20;

-- ============================================
-- STEP 3: Create View for Easy Song Fetching
-- ============================================
CREATE OR REPLACE VIEW songs_with_artist AS
SELECT 
  s.*,
  a.name as artist_name_display
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id;

-- Test the view
SELECT 
  id,
  title,
  artist_name_display
FROM songs_with_artist 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- STEP 4: Find Songs Without Artist Link
-- ============================================
SELECT 
  s.id,
  s.title,
  s.artist_id
FROM songs s
WHERE s.artist_id IS NULL
   OR NOT EXISTS (SELECT 1 FROM artists a WHERE a.id = s.artist_id);

-- ============================================
-- DONE! ✅
-- Songs should now show artist name correctly
-- If any songs have NULL artist_id, you need to:
-- 1. Create the artist first
-- 2. Update the song with the correct artist_id
-- ============================================
