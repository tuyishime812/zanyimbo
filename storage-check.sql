-- ============================================
-- DGT SOUNDS - Storage Diagnostic
-- Run this to check your storage setup
-- ============================================

-- STEP 1: Check if buckets exist
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id IN ('music', 'covers');

-- Expected: Should see 2 rows (music and covers)
-- If empty: Buckets don't exist

-- STEP 2: Check existing policies
SELECT 
  policyname,
  cmd as operation,
  roles as target_role,
  qual as using_clause,
  with_check as check_clause
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- Expected: Should see 8+ policies

-- STEP 3: Check bucket permissions
SELECT 
  has_schema_privilege('authenticated', 'storage', 'USAGE') as schema_usage,
  has_table_privilege('authenticated', 'storage.objects', 'INSERT') as insert_privilege,
  has_table_privilege('authenticated', 'storage.objects', 'UPDATE') as update_privilege,
  has_table_privilege('authenticated', 'storage.objects', 'DELETE') as delete_privilege;

-- Expected: All should be TRUE

-- STEP 4: List all storage objects
SELECT 
  bucket_id,
  name,
  owner,
  created_at
FROM storage.objects
ORDER BY created_at DESC
LIMIT 10;

-- Expected: Should see your uploaded files

-- STEP 5: Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'storage' 
  AND tablename = 'objects';

-- Expected: rls_enabled = true

-- ============================================
-- DIAGNOSIS:
-- ============================================
-- If buckets exist but you get 503:
-- 1. Check if you're logged in as admin
-- 2. Check browser console for exact error
-- 3. Verify storage bucket is PUBLIC
-- 4. Try re-uploading after running this

-- If buckets don't exist:
-- Create them manually in Supabase Dashboard:
-- Storage > New Bucket > music (Public)
-- Storage > New Bucket > covers (Public)
-- ============================================
