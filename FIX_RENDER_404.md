# 🚨 FIX: 404 Not Found on Render

## ❌ Problem
Getting "Not Found" error when accessing routes like `/admin` on Render.

## ✅ Solution

### The Issue:
Render (and other static hosts) need a redirect rule to handle Single Page Application (SPA) routing.

### Fix 1: Update render.yaml

Your `render.yaml` should have this:

```yaml
services:
  - type: web
    name: dgt-sounds
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npx serve dist -s -l $PORT
```

**Key:** The `-s` flag in `serve dist -s` enables SPA mode!

### Fix 2: Ensure _redirects is in dist folder

After building, check if `_redirects` file exists in `dist/` folder.

If NOT, add this to `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Copy _redirects to dist after build
  buildEnd: () => {
    copyFileSync('public/_redirects', 'dist/_redirects')
  }
})
```

### Fix 3: Use render.yaml Correctly

Make sure your `render.yaml` looks like this:

```yaml
services:
  - type: web
    name: dgt-sounds
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npx serve dist -s -l $PORT
    envVars:
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
```

**Key Points:**
- ✅ Use `type: web` (NOT `static`)
- ✅ Use `startCommand: npx serve dist -s -l $PORT`
- ✅ The `-s` flag enables SPA routing

---

## 🎯 Quick Fix Steps:

### Step 1: Check render.yaml

Make sure it has:
```yaml
startCommand: npx serve dist -s -l $PORT
```

### Step 2: Redeploy

1. Go to Render Dashboard
2. Select your site
3. Click "Manual Deploy"
4. Choose branch: `main`
5. Click "Deploy"

### Step 3: Test

After deploy completes:
- Visit: `https://dgt-sounds.onrender.com/admin`
- Should work now! ✅

---

## 📋 Alternative: Use Static Site (No Start Command)

If you want to use **Static Site** instead of Web Service:

### Step 1: Create _redirects file

Make sure `public/_redirects` exists with:
```
/*    /index.html   200
```

### Step 2: Update vite.config.js

Add this to ensure _redirects is copied:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
```

Vite automatically copies `public/` folder to `dist/`

### Step 3: Deploy as Static Site

1. Choose **Static Site** (not Web Service)
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. No start command needed

---

## ✅ Recommended: Use Web Service

For best results, use **Web Service** with:

```yaml
type: web
buildCommand: npm install && npm run build
startCommand: npx serve dist -s -l $PORT
```

This ensures:
- ✅ SPA routing works
- ✅ All routes work (/admin, /music, /top-10, etc.)
- ✅ No 404 errors

---

**After fixing, your admin panel will work!** 🚀
