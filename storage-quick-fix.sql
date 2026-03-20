-- ============================================
-- DGT SOUNDS - Quick Storage Fix
-- Run this to refresh storage access
-- ============================================

-- STEP 1: Refresh bucket policies
-- Drop old policies first
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
END $$;

-- STEP 2: Recreate policies for MUSIC bucket
CREATE POLICY "music_public_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'music');

CREATE POLICY "music_authenticated_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'music');

CREATE POLICY "music_authenticated_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'music');

CREATE POLICY "music_authenticated_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'music');

-- STEP 3: Recreate policies for COVERS bucket
CREATE POLICY "covers_public_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'covers');

CREATE POLICY "covers_authenticated_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "covers_authenticated_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'covers');

CREATE POLICY "covers_authenticated_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'covers');

-- STEP 4: Grant permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- STEP 5: Verify
SELECT 'Policies recreated successfully!' as status;
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- DONE! Try uploading a song now
-- ============================================
