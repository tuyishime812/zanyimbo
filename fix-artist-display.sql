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
  s.artist_name,
  a.id as artist_id_check,
  a.name as artist_name_check
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id
LIMIT 10;

-- ============================================
-- STEP 2: Fix Songs That Have Wrong Artist Data
-- ============================================

-- If songs have artist_id but it's showing UUID, 
-- this will ensure the relationship is correct
UPDATE songs
SET artist_id = (
  SELECT id FROM artists 
  WHERE artists.name = songs.artist_name
  LIMIT 1
)
WHERE artist_id IS NULL AND artist_name IS NOT NULL;

-- ============================================
-- STEP 3: Verify Artist Relationship
-- ============================================
SELECT 
  s.id,
  s.title,
  s.artist_name,
  a.name as linked_artist_name
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id
ORDER BY s.created_at DESC
LIMIT 20;

-- ============================================
-- STEP 4: Create View for Easy Song Fetching
-- ============================================
CREATE OR REPLACE VIEW songs_with_artist AS
SELECT 
  s.*,
  a.name as artist_name_display
FROM songs s
LEFT JOIN artists a ON s.artist_id = a.id;

-- Test the view
SELECT * FROM songs_with_artist ORDER BY created_at DESC LIMIT 10;

-- ============================================
-- DONE! ✅
-- Songs should now show artist name correctly
-- ============================================
