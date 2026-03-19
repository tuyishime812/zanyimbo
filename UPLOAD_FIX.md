# 🎵 DGT Sounds - Admin Song Upload Fix

## ❌ Problem
Getting 503 error when trying to upload songs to Supabase storage.

## ✅ Solution

### Step 1: Fix Storage Bucket Permissions

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

3. **Run the Fix Script**
   - Copy contents of `fix-storage-permissions.sql`
   - Paste and click **Run**

### Step 2: Verify Storage Buckets

1. **Go to Storage**
   - Click **Storage** in left sidebar

2. **Check Buckets Exist**
   - Should see `music` bucket
   - Should see `covers` bucket
   - Both should be **Public** (globe icon)

3. **Check Policies**
   - Click on `music` bucket
   - Click **Policies** tab
   - Should have:
     - ✅ Public read access
     - ✅ Authenticated upload access
   - Repeat for `covers` bucket

### Step 3: Test Upload

1. **Go to Admin Panel**
   - Login as admin (jeterothako276@gmail.com)
   - Go to `/admin/songs`

2. **Add Song**
   - Click **Add Song**
   - Fill in details
   - Upload audio file
   - Click **Add Song**

## 🔧 What the SQL Fix Does

1. ✅ Creates `music` and `covers` buckets if missing
2. ✅ Sets buckets to PUBLIC
3. ✅ Allows authenticated users to upload
4. ✅ Allows everyone to read (stream music)
5. ✅ Allows admins to update/delete

## 📋 Required Table Structure

Make sure these tables exist:
- `songs`
- `artists`
- `albums`
- `genres`
- `song_genres` (junction table)

## 🐛 Common Issues

### Issue 1: "Bucket not found"
**Solution:** Run the `fix-storage-permissions.sql` script

### Issue 2: "Permission denied"
**Solution:** 
1. Make sure you're logged in as admin
2. Check storage bucket policies
3. Verify user is in `admin_roles` table

### Issue 3: File too large
**Solution:** 
- Default limit: 50MB
- Increase in Supabase: Settings > Storage > File size limit

### Issue 4: CORS error
**Solution:** 
- Go to Storage > Settings
- Enable CORS for your domain

## 📞 Support

If still having issues:
1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Verify all SQL scripts have been run

## 🎯 Quick Test

After running fixes, test this:
```sql
-- Check buckets
SELECT * FROM storage.buckets WHERE id IN ('music', 'covers');

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Test upload permission
-- (Try uploading a song in admin panel)
```

---

**Last Updated:** 2026-03-18
**Admin Email:** jeterothako276@gmail.com
