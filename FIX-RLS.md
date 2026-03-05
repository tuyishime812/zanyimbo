# 🔧 Fix RLS Policies for Admin Panel

## Problem
If you're getting errors like:
- "new row violates row-level security policy for table 'artists'"
- "new row violates row-level security policy for table 'albums'"
- "new row violates row-level security policy for table 'songs'"

This is because the Row Level Security (RLS) policies need to be updated to properly recognize admin users.

---

## ✅ Solution (2 Steps)

### Step 1: Run the SQL Fix Script

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Copy the contents of `fix-rls-policies.sql`
4. Paste and click **Run**

This will update the RLS policies to properly check for admin role.

---

### Step 2: Verify Your Admin User

After running the SQL, verify your admin user has the correct role:

```sql
-- Check if your user has admin role
SELECT email, raw_app_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your-admin-email@example.com';
```

If the role is not 'admin', run this:

```sql
-- Make your user an admin
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}' 
WHERE email = 'your-admin-email@example.com';
```

---

## 🎯 Test It Works

After running the SQL:

1. **Refresh** your app (Ctrl+R or F5)
2. Go to **Admin → Songs**
3. Click **Add Song**
4. Fill in the form:
   - Song Title: "Test Song"
   - Artist Name: "Test Artist" (will be created automatically)
   - Album Name: "Test Album" (optional, will be created)
   - Upload an audio file
   - Click **Add Song**

✅ If it saves successfully, the RLS policies are working!

---

## 🔍 What the SQL Does

The SQL script:

1. **Drops old RLS policies** that might conflict
2. **Creates new policies** that properly check for admin role in `raw_app_meta_data`
3. **Verifies** current admin users

The new policies check:
```sql
EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.users.id = auth.uid()
  AND (auth.users.raw_app_meta_data->>'role') = 'admin'
)
```

This ensures only users with `role: "admin"` in their metadata can insert/update/delete.

---

## 📋 All Admin Features That Now Work

### ✅ Songs Management
- Add new songs with text inputs for artist/album
- Auto-create artists and albums
- Edit existing songs
- Delete songs
- Upload audio files and cover art
- Set duration, enable downloads, mark as featured

### ✅ Albums Management
- Add new albums with text input for artist name
- Auto-create artists
- Edit existing albums
- Delete albums
- Upload cover art
- Set release date, mark as featured

### ✅ Artists Management
- Add new artists
- Edit artist info
- Delete artists (cascades to their songs/albums)
- Upload artist images
- Mark as verified

### ✅ Users Management
- View all users
- See admin roles
- Delete users
- Search users

### ✅ Dashboard
- View stats (songs, albums, artists, plays, downloads)
- See recently added songs

### ✅ Settings
- Site configuration
- Feature toggles
- Database status

---

## 🐛 Still Having Issues?

### Check Supabase Console

1. Go to **Authentication** → **Users**
2. Find your admin user
3. Click the 3 dots → **View details**
4. Check `raw_app_meta_data` has: `{"role": "admin"}`

### Check Storage Buckets

Make sure buckets exist:
- `music` (public)
- `covers` (public)

Go to **Storage** and verify both buckets are created and public.

### Check Console Logs

Open browser DevTools (F12) and check the Console tab for detailed error messages.

---

## 📞 Need Help?

If you're still stuck:

1. Check the browser console for error messages
2. Check Supabase logs in the Dashboard
3. Make sure your `.env` has correct Supabase credentials
4. Verify you're logged in as admin

---

**Good luck! 🚀**
