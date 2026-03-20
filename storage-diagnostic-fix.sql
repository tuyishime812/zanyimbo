-- ============================================
-- DGT SOUNDS - COMPLETE STORAGE DIAGNOSTIC
-- Run this ENTIRE script to find the problem
-- ============================================

-- ============================================
-- STEP 1: Check if Storage Buckets Exist
-- ============================================
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id IN ('music', 'covers');

-- Expected: Should see 2 rows (music and covers)
-- If EMPTY: Buckets don't exist - create them below

-- ============================================
-- STEP 2: Create Buckets if Missing
-- ============================================
-- ONLY RUN THIS IF STEP 1 RETURNED EMPTY

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('music', 'music', true),
  ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Check Storage Policies
-- ============================================
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- Expected: Should see 8+ policies
-- If EMPTY: No policies exist - create them below

-- ============================================
-- STEP 4: Drop ALL Existing Storage Policies
-- ============================================
-- This ensures clean slate

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "music_public_read" ON storage.objects;
  DROP POLICY IF EXISTS "music_authenticated_upload" ON storage.objects;
  DROP POLICY IF EXISTS "music_authenticated_update" ON storage.objects;
  DROP POLICY IF EXISTS "music_authenticated_delete" ON storage.objects;
  DROP POLICY IF EXISTS "covers_public_read" ON storage.objects;
  DROP POLICY IF EXISTS "covers_authenticated_upload" ON storage.objects;
  DROP POLICY IF EXISTS "covers_authenticated_update" ON storage.objects;
  DROP POLICY IF EXISTS "covers_authenticated_delete" ON storage.objects;
  DROP POLICY IF EXISTS "Public Read Music" ON storage.objects;
  DROP POLICY IF EXISTS "Upload Music" ON storage.objects;
  DROP POLICY IF EXISTS "Update Music" ON storage.objects;
  DROP POLICY IF EXISTS "Delete Music" ON storage.objects;
  DROP POLICY IF EXISTS "Public Read Covers" ON storage.objects;
  DROP POLICY IF EXISTS "Upload Covers" ON storage.objects;
  DROP POLICY IF EXISTS "Update Covers" ON storage.objects;
  DROP POLICY IF EXISTS "Delete Covers" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
END $$;

-- ============================================
-- STEP 5: Create Fresh Policies for MUSIC
-- ============================================

-- Policy 1: Everyone can read music
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
-- STEP 6: Create Fresh Policies for COVERS
-- ============================================

-- Policy 5: Everyone can read covers
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
-- STEP 7: Grant Permissions
-- ============================================
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- ============================================
-- STEP 8: Verify Everything
-- ============================================

-- Check buckets
SELECT 'BUCKETS:' as status;
SELECT id, name, public FROM storage.buckets;

-- Check policies
SELECT 'POLICIES:' as status;
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- STEP 9: Test Upload Permission
-- ============================================
-- This checks if authenticated users can upload

SELECT 
  has_schema_privilege('authenticated', 'storage', 'USAGE') as schema_usage,
  has_table_privilege('authenticated', 'storage.objects', 'INSERT') as insert_privilege,
  has_table_privilege('authenticated', 'storage.buckets', 'USAGE') as bucket_privilege;

-- Expected: All should return TRUE

-- ============================================
-- DONE! ✅
-- 
-- If you still get 503 error:
-- 1. Check if you're logged in as admin
-- 2. Check browser console for exact error
-- 3. Verify buckets exist in Supabase Storage UI
-- ============================================
