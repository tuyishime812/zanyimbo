# 🚀 DEPLOY DGT SOUNDS ON RENDER - COMPLETE GUIDE

## ⚠️ CRITICAL: Choose STATIC SITE Not Web Service!

This is the #1 mistake - choose **Static Site** NOT Web Service!

---

## 📋 Method 1: One-Click Deploy (EASIEST)

### Step 1: Click Deploy Button

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tuyishime812/zanyimbo)

### Step 2: Connect GitHub

1. Click "Connect GitHub"
2. Authorize Render to access your repos
3. Select `tuyishime812/zanyimbo` repository

### Step 3: Configure (Auto-filled)

Render will auto-fill:
```
Name: dgt-sounds
Branch: main
Root Directory: (blank)
Build Command: npm install && npm run build
Publish Directory: dist
```

### Step 4: Add Environment Variables

Click "Advanced" and add:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

**Where to get these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

### Step 5: Click "Create Static Site"

- Wait 3-5 minutes for build
- Your site will be live!

### Step 6: Get Your URL

Your site will be at:
```
https://dgt-sounds.onrender.com
```

---

## 📋 Method 2: Manual Setup

### Step 1: Login to Render

1. Go to https://render.com
2. Login with GitHub

### Step 2: Create New Static Site

1. Click **New +**
2. Select **Static Site**
3. Connect your repository: `tuyishime812/zanyimbo`

### Step 3: Configure Settings

```yaml
Name: dgt-sounds
Region: Frankfurt (or closest to you)
Branch: main
Root Directory: (leave blank)
Build Command: npm install && npm run build
Publish Directory: dist
```

### Step 4: Environment Variables

Scroll to "Environment" section, click "Add Environment Variable":

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

### Step 5: Click "Create Static Site"

- Build will start automatically
- Wait for build to complete
- You'll get a URL like: `https://dgt-sounds.onrender.com`

---

## ✅ After Deployment

### 1. Test Your Site

Visit: `https://dgt-sounds.onrender.com`

### 2. Test Admin Panel

Visit: `https://dgt-sounds.onrender.com/admin`

Login with:
- Email: `jeterothako276@gmail.com`
- Your password

### 3. Test Upload Songs

1. Go to `/admin/songs`
2. Click "Add Song"
3. Upload a test song
4. Should work! ✅

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error:** `npm ERR! missing script: build`

**Solution:**
- Make sure `package.json` has `"build": "vite build"`
- Check you're using Static Site not Web Service

### Issue 2: Site Shows Blank Page

**Solution:**
- Check environment variables are set correctly
- Check browser console for errors
- Verify Supabase URL and key are correct

### Issue 3: Can't Upload Songs

**Solution:**
- Run `create-storage-policies.sql` in Supabase
- Run `fix-all-rls-policies.sql` in Supabase
- Check you're logged in as admin

### Issue 4: 503 Error

**Solution:**
- Run `storage-diagnostic-fix.sql` in Supabase
- Verify storage buckets exist
- Check storage policies are set

---

## 🌐 Custom Domain (Optional)

### Step 1: Buy Domain

- Go to Namecheap, GoDaddy, etc.
- Buy your domain (e.g., `dgt-sounds.com`)

### Step 2: Add to Render

1. Go to Render Dashboard
2. Select your site
3. Click "Settings"
4. Scroll to "Custom Domains"
5. Click "Add Custom Domain"
6. Enter: `dgt-sounds.com`
7. Follow DNS instructions

### Step 3: Update DNS

At your domain registrar:
```
Type: CNAME
Name: www
Value: your-app.onrender.com
```

### Step 4: Enable HTTPS

- Render auto-provisions SSL
- Takes 5-10 minutes
- Your site will be at: `https://dgt-sounds.com`

---

## 📊 Your Deployed App

Once deployed, your app will be available at:

**Production URL:**
```
https://dgt-sounds.onrender.com
```

**Admin Panel:**
```
https://dgt-sounds.onrender.com/admin
```

**Music Page:**
```
https://dgt-sounds.onrender.com/music
```

**Top 10:**
```
https://dgt-sounds.onrender.com/top-10
```

---

## 🎯 Quick Checklist

Before deploying, make sure:

- ✅ `render.yaml` exists (✅ Already done!)
- ✅ Supabase project is set up
- ✅ Storage buckets created (music, covers)
- ✅ RLS policies fixed
- ✅ Environment variables ready
- ✅ Admin user created

---

## 📞 Support

If you need help:

1. Check Render logs: Dashboard → Logs
2. Check Supabase logs: Dashboard → Logs
3. Check browser console (F12)
4. Run diagnostic SQLs in Supabase

---

**Ready to deploy! 🚀**

Your `render.yaml` is already configured - just click the deploy button!
