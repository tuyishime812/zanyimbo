# 🚨 URGENT FIX - 503 Storage Error

## ⚠️ Problem
Getting 503 error when uploading songs to Supabase.

## ✅ QUICK FIX - Follow These Steps EXACTLY:

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** (left sidebar)

### Step 2: Check if Buckets Exist
1. Do you see `music` bucket? 
2. Do you see `covers` bucket?

**If NO → Create them manually:**
1. Click **New Bucket**
2. Name: `music`
3. Toggle **Public bucket** = ON
4. Click **Create bucket**
5. Repeat for `covers`

### Step 3: Add Policies Manually

#### For MUSIC bucket:
1. Click on `music` bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Click **Create a policy from scratch**
5. Name: `Public Read Music`
6. Policy type: `SELECT`
7. Target: `public`
8. Policy definition (SQL):
```sql
bucket_id = 'music'
```
9. Click **Review** then **Save Policy**

**Repeat for INSERT:**
- Name: `Upload Music`
- Policy type: `INSERT`
- Target: `authenticated`
- Policy definition:
```sql
bucket_id = 'music'
```

**Repeat for UPDATE:**
- Name: `Update Music`
- Policy type: `UPDATE`
- Target: `authenticated`
- Policy definition:
```sql
bucket_id = 'music'
```

**Repeat for DELETE:**
- Name: `Delete Music`
- Policy type: `DELETE`
- Target: `authenticated`
- Policy definition:
```sql
bucket_id = 'music'
```

#### For COVERS bucket:
**Repeat same steps but change:**
- Name to `Public Read Covers`, `Upload Covers`, etc.
- Policy definition to: `bucket_id = 'covers'`

### Step 4: Test Upload
1. Go to your app admin: `/admin/songs`
2. Login as admin
3. Try uploading a song
4. Should work now! ✅

---

## 📋 Alternative: Run SQL (If Manual Steps Fail)

If manual steps don't work, run this SQL in SQL Editor:

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;
```

Then add policies one by one (don't run all at once):

```sql
-- Policy 1
CREATE POLICY "Public Read Music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'music');
```

Run it → Check for errors → Then run next:

```sql
-- Policy 2
CREATE POLICY "Upload Music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music');
```

And so on for all 8 policies.

---

## ❓ Still Not Working?

### Check These:
1. ✅ Are you logged in as admin?
2. ✅ Do buckets exist in Storage?
3. ✅ Are buckets set to PUBLIC?
4. ✅ Do all 8 policies exist (4 for music, 4 for covers)?

### Get Help:
1. Take screenshot of error
2. Take screenshot of Storage > Buckets
3. Take screenshot of Storage > Policies
4. Share in support channel

---

**Last Updated:** 2026-03-18
**Status:** URGENT FIX NEEDED
