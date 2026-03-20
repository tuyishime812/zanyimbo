-- ============================================
-- DGT SOUNDS - FIX MISSING TABLES
-- Run this to create missing tables
-- ============================================

-- 1. Create likes table (MISSING - causing 404 error)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "likes_public_read" ON likes FOR SELECT TO public USING (true);
CREATE POLICY "likes_authenticated_write" ON likes FOR ALL TO authenticated USING (true);

-- 2. Fix admin_roles table query issue
-- Drop and recreate with correct structure
DROP POLICY IF EXISTS "admin_roles_read" ON admin_roles;
DROP POLICY IF EXISTS "admin_roles_write" ON admin_roles;

CREATE POLICY "admin_roles_select" ON admin_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_roles_insert" ON admin_roles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_roles_update" ON admin_roles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "admin_roles_delete" ON admin_roles FOR DELETE TO authenticated USING (true);

-- 3. Create downloads table if missing
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "downloads_public_read" ON downloads FOR SELECT TO public USING (true);
CREATE POLICY "downloads_authenticated_write" ON downloads FOR ALL TO authenticated USING (true);

-- 4. Create user_profiles table if missing
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_public_read" ON user_profiles FOR SELECT TO public USING (true);
CREATE POLICY "user_profiles_authenticated_write" ON user_profiles FOR ALL TO authenticated USING (true);

-- 5. Verify all tables exist
SELECT 'TABLES CREATED:' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- ============================================
-- DONE! All missing tables created
-- ============================================
