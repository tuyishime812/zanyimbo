-- ============================================
-- DGT SOUNDS - Fix Storage Bucket Permissions
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CHECK IF BUCKETS EXIST
-- ============================================
SELECT id, name, public 
FROM storage.buckets 
WHERE id IN ('music', 'covers');

-- ============================================
-- 2. CREATE BUCKETS IF THEY DON'T EXIST
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('music', 'music', true),
  ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects FOR SELECT;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects FOR INSERT;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects FOR UPDATE;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects FOR DELETE;

DROP POLICY IF EXISTS "Music public read" ON storage.objects;
DROP POLICY IF EXISTS "Music authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Covers public read" ON storage.objects;
DROP POLICY IF EXISTS "Covers authenticated upload" ON storage.objects;

-- ============================================
-- 4. CREATE PUBLIC READ POLICY FOR ALL BUCKETS
-- ============================================
CREATE POLICY "Music public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'music');

CREATE POLICY "Covers public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'covers');

-- ============================================
-- 5. CREATE AUTHENTICATED UPLOAD POLICY
-- ============================================
CREATE POLICY "Music authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'music');

CREATE POLICY "Covers authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers');

-- ============================================
-- 6. CREATE UPDATE/DELETE POLICIES FOR ADMINS
-- ============================================
CREATE POLICY "Music authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'music');

CREATE POLICY "Music authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'music');

CREATE POLICY "Covers authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers');

CREATE POLICY "Covers authenticated delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers');

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- ============================================
-- 8. VERIFY SETUP
-- ============================================
SELECT 
  b.id,
  b.name,
  b.public,
  COUNT(o.id) as object_count
FROM storage.buckets b
LEFT JOIN storage.objects o ON b.id = o.bucket_id
WHERE b.id IN ('music', 'covers')
GROUP BY b.id, b.name, b.public;

-- ============================================
-- 9. CHECK POLICIES
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY tablename, policyname;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Go to Storage > Policies to verify
-- 3. Buckets should be PUBLIC
-- 4. Authenticated users can upload
-- 5. Everyone can read (public)
-- ============================================
