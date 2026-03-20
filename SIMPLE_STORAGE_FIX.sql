-- ============================================
-- DGT SOUNDS - SIMPLE STORAGE FIX
-- Run each line separately if needed
-- ============================================

-- STEP 1: Drop existing policies (run one by one)
DROP POLICY IF EXISTS "music_read" ON storage.objects;
DROP POLICY IF EXISTS "music_upload" ON storage.objects;
DROP POLICY IF EXISTS "music_update" ON storage.objects;
DROP POLICY IF EXISTS "music_delete" ON storage.objects;
DROP POLICY IF EXISTS "covers_read" ON storage.objects;
DROP POLICY IF EXISTS "covers_upload" ON storage.objects;
DROP POLICY IF EXISTS "covers_update" ON storage.objects;
DROP POLICY IF EXISTS "covers_delete" ON storage.objects;
DROP POLICY IF EXISTS "music_public_read" ON storage.objects;
DROP POLICY IF EXISTS "music_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "music_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "music_authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "covers_public_read" ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_delete" ON storage.objects;

-- STEP 2: Create buckets (will skip if exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Create policies for MUSIC
CREATE POLICY "music_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'music');

CREATE POLICY "music_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'music');

CREATE POLICY "music_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'music');

CREATE POLICY "music_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'music');

-- STEP 4: Create policies for COVERS
CREATE POLICY "covers_read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'covers');

CREATE POLICY "covers_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "covers_update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'covers');

CREATE POLICY "covers_delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'covers');

-- STEP 5: Grant permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- STEP 6: Verify
SELECT 'DONE! Buckets and policies created' as status;
SELECT id, name, public FROM storage.buckets WHERE id IN ('music', 'covers');
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' ORDER BY policyname;
