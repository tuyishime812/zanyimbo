-- ============================================
-- DGT SOUNDS - Complete Storage Setup
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Create Storage Buckets
-- ============================================

-- Create music bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Create covers bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Verify buckets created
SELECT id, name, public FROM storage.buckets WHERE id IN ('music', 'covers');

-- ============================================
-- STEP 2: Create Policies for MUSIC Bucket
-- ============================================

-- Policy 1: Public can read music files
CREATE POLICY "music_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'music');

-- Policy 2: Authenticated users can upload music
CREATE POLICY "music_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');

-- Policy 3: Authenticated users can update music
CREATE POLICY "music_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'music');

-- Policy 4: Authenticated users can delete music
CREATE POLICY "music_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'music');

-- ============================================
-- STEP 3: Create Policies for COVERS Bucket
-- ============================================

-- Policy 5: Public can read cover files
CREATE POLICY "covers_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

-- Policy 6: Authenticated users can upload covers
CREATE POLICY "covers_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

-- Policy 7: Authenticated users can update covers
CREATE POLICY "covers_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers');

-- Policy 8: Authenticated users can delete covers
CREATE POLICY "covers_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers');

-- ============================================
-- STEP 4: Verify All Policies Created
-- ============================================

SELECT 
  policyname as policy_name,
  cmd as operation,
  roles as target_role
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%music%'
  OR policyname LIKE '%covers%'
ORDER BY policyname;

-- ============================================
-- STEP 5: Grant Permissions
-- ============================================

GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- ============================================
-- DONE! ✅
-- 
-- Buckets Created:
-- - music (public)
-- - covers (public)
--
-- Policies Created:
-- - 4 policies for music bucket
-- - 4 policies for covers bucket
--
-- Now you can upload songs! 🎵
-- ============================================
