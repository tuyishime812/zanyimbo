# 🚀 COMPLETE FRESH START - New Supabase Setup

## ✅ This is the BEST solution - start completely fresh!

---

## 📋 STEP 1: Create New Supabase Account

### Option A: New Email
1. Go to: https://supabase.com
2. Click "Sign Up"
3. Use a **different email** (e.g., dgt.sounds.admin@gmail.com)
4. Verify email
5. Create new project

### Option B: Same Email, New Organization
1. Go to: https://supabase.com/dashboard
2. Click your organization name (top left)
3. Click "Create new organization"
4. Name: "DGT Sounds"
5. Click "Create"

---

## 📋 STEP 2: Create New Project

1. Click **"New Project"**
2. Fill in:
   ```
   Name: dgt-sounds
   Database Password: [SAVE THIS!]
   Region: Frankfurt (or closest to you)
   Pricing Plan: Free
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

---

## 📋 STEP 3: Get Your Credentials

1. Go to **Settings** (bottom left)
2. Click **API**
3. Copy these:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbG... (long string)
   ```
4. **Save these!** You'll need them for Render

---

## 📋 STEP 4: Run Complete Setup SQL

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy **ENTIRE** content below (STEP 5 SQL)
4. Paste and **Click RUN**
5. Wait for success message

---

## 📋 STEP 5: Complete Setup SQL

Copy and run this ENTIRE script:

```sql
-- ============================================
-- DGT SOUNDS - COMPLETE FRESH SETUP
-- Run this ONCE on new Supabase project
-- ============================================

-- 1. Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id),
  cover_url TEXT,
  track_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

-- 4. Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id),
  album_id UUID REFERENCES albums(id),
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration INTEGER,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_downloadable BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create song_genres junction table
CREATE TABLE IF NOT EXISTS song_genres (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

-- 6. Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- 7. Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for artists
CREATE POLICY "artists_public_read" ON artists FOR SELECT TO public USING (true);
CREATE POLICY "artists_authenticated_write" ON artists FOR ALL TO authenticated USING (true);

-- 9. Create policies for albums
CREATE POLICY "albums_public_read" ON albums FOR SELECT TO public USING (true);
CREATE POLICY "albums_authenticated_write" ON albums FOR ALL TO authenticated USING (true);

-- 10. Create policies for songs
CREATE POLICY "songs_public_read" ON songs FOR SELECT TO public USING (true);
CREATE POLICY "songs_authenticated_write" ON songs FOR ALL TO authenticated USING (true);

-- 11. Create policies for genres
CREATE POLICY "genres_public_read" ON genres FOR SELECT TO public USING (true);
CREATE POLICY "genres_authenticated_write" ON genres FOR ALL TO authenticated USING (true);

-- 12. Create policies for song_genres
CREATE POLICY "song_genres_public_read" ON song_genres FOR SELECT TO public USING (true);
CREATE POLICY "song_genres_authenticated_write" ON song_genres FOR ALL TO authenticated USING (true);

-- 13. Create policies for admin_roles
CREATE POLICY "admin_roles_read" ON admin_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_roles_write" ON admin_roles FOR ALL TO service_role USING (true);

-- 14. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true),
       ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- 15. Create storage policies for MUSIC
CREATE POLICY "music_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'music');
CREATE POLICY "music_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'music');
CREATE POLICY "music_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'music');
CREATE POLICY "music_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'music');

-- 16. Create storage policies for COVERS
CREATE POLICY "covers_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'covers');
CREATE POLICY "covers_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');
CREATE POLICY "covers_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers');
CREATE POLICY "covers_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers');

-- 17. Grant permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- ============================================
-- DONE! ✅ All tables, policies, and buckets created
-- ============================================
```

---

## 📋 STEP 6: Add Your Admin Email

Run this SQL (replace with your email):

```sql
-- Add your admin email
INSERT INTO admin_roles (user_id, email)
SELECT id, email FROM auth.users 
WHERE email = 'jeterothako276@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
```

**Or create admin user:**
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Email: `jeterothako276@gmail.com`
4. Password: `admin123` (change later!)
5. Click **Create user**
6. Run the SQL above

---

## 📋 STEP 7: Update Render Environment Variables

1. Go to **Render Dashboard**
2. Select `dgt-sounds`
3. Click **Environment**
4. Update these:
   ```
   VITE_SUPABASE_URL = https://YOUR-NEW-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY = your-new-anon-key
   ```
5. Click **Save Changes**
6. Redeploy (Manual Deploy → main branch)

---

## 📋 STEP 8: Test Everything

1. **Clear browser cache** (`Ctrl + Shift + R`)
2. Go to: `https://dgt-sounds.onrender.com`
3. Test homepage - should load
4. Go to: `/admin`
5. Login with admin email
6. Try uploading a song - **Should work!** ✅

---

## ✅ Checklist

```
☐ Created new Supabase account/organization
☐ Created new project
☐ Saved project URL and anon key
☐ Ran complete setup SQL
☐ Added admin email
☐ Updated Render environment variables
☐ Redeployed on Render
☐ Tested song upload - WORKS!
```

---

## 🎉 You're Done!

**Fresh start = No more 503 errors!** 🚀

Your new Supabase project has:
- ✅ Clean database tables
- ✅ Fresh storage buckets
- ✅ Correct policies
- ✅ No old/broken config

---

**Start from STEP 1 now!** 🎵✨
