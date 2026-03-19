-- ============================================
-- SIMPLE FIX - Run Each Section Separately
-- DGT Sounds Storage Fix
-- ============================================

-- STEP 1: Check if buckets exist
SELECT id, name, public FROM storage.buckets;

-- STEP 2: Create buckets (run if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Verify buckets created
SELECT id, name, public FROM storage.buckets WHERE id IN ('music', 'covers');

-- ============================================
-- STEP 4: Create Policies (Run each line separately)
-- ============================================

-- Policy 1: Public can read music
CREATE POLICY "Public Read Music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'music');

-- Policy 2: Public can read covers
CREATE POLICY "Public Read Covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');

-- Policy 3: Authenticated users can upload music
CREATE POLICY "Upload Music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');

-- Policy 4: Authenticated users can upload covers
CREATE POLICY "Upload Covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'covers');

-- Policy 5: Authenticated users can update music
CREATE POLICY "Update Music"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'music');

-- Policy 6: Authenticated users can update covers
CREATE POLICY "Update Covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'covers');

-- Policy 7: Authenticated users can delete music
CREATE POLICY "Delete Music"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'music');

-- Policy 8: Authenticated users can delete covers
CREATE POLICY "Delete Covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'covers');

-- ============================================
-- STEP 5: Verify policies created
-- ============================================
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- DONE! Buckets and policies should now work
-- ============================================
