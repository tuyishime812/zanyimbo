# Firebase + Supabase Storage Setup Guide

This project uses **Firebase for database/authentication** and **Supabase for storage buckets**.

## Architecture

- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Supabase Storage (music & covers buckets)

---

## Step 1: Firebase Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `dgt-sounds` (or your preferred name)
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### 1.2 Register a Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon `</>`
4. Register app with nickname: `DGT Sounds Web`
5. Copy the `firebaseConfig` values

### 1.3 Enable Firebase Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Click **Save**

### 1.4 Create Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location closest to your users
5. Click **Enable**

### 1.5 Set Up Firestore Security Rules

In Firestore **Rules** tab, add:

```rules_version
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for most collections
    match /{collection}/{doc} {
      allow read: if true;
    }
    
    // Only authenticated users can write
    match /{collection}/{doc} {
      allow write: if request.auth != null;
    }
    
    // Admin-only collections (admin_users)
    match /admin_users/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.is_super_admin == true;
    }
  }
}
```

### 1.6 Copy Firebase Config to .env

From your Firebase app settings, copy these values to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Step 2: Supabase Storage Setup

### 2.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up / Log in
3. Click **New Project**
4. Enter project details
5. Set a strong database password
6. Choose a region closest to your users
7. Click **Create new project**

### 2.2 Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Create bucket named: `music`
   - Set **Public bucket** = true
   - Click **Create bucket**
4. Create another bucket named: `covers`
   - Set **Public bucket** = true
   - Click **Create bucket**

### 2.3 Set Up Storage Policies

For the `music` bucket:

1. Go to **Storage** → `music` bucket → **Policies**
2. Click **New policy**
3. Add these policies:

**Public Read Policy:**
```sql
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'music')
```

**Authenticated Upload Policy:**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'music')
```

**Authenticated Delete Policy:**
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'music')
```

Repeat for the `covers` bucket (replace 'music' with 'covers').

### 2.4 Copy Supabase Config to .env

1. Go to **Project Settings** → **API**
2. Copy these values to `.env`:

```env
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 3: Seed Initial Data

### 3.1 Create Admin User in Firebase

1. Go to **Authentication** → **Users** in Firebase Console
2. Click **Add user**
3. Enter email: `admin@dgt-sounds.com`
4. Enter password: (your secure password)
5. Click **Add user**

### 3.2 Add Admin Record in Firestore

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `admin_users`
4. Add document with these fields:
   - `email`: `admin@dgt-sounds.com`
   - `is_super_admin`: `true` (boolean)
   - `created_at`: (leave as Server timestamp)

### 3.3 Seed Genres

Create a collection `genres` and add these documents:

```
- Afrobeats
- Hip Hop
- R&B
- Gospel
- Traditional
- Jazz
- Amapiano
- Afro-pop
- Dancehall
- Reggae
- Soul
- Funk
```

### 3.4 Seed Categories

Create a collection `categories` and add:

```
- Music (status: live)
- TV & Movies (status: coming_soon)
- Beats Marketplace (status: coming_soon)
- Events (status: coming_soon)
- Podcasts (status: coming_soon)
```

---

## Step 4: Update Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase and Supabase credentials.

---

## Step 5: Install Dependencies

```bash
npm install
```

Required packages:
- `firebase` - Firebase SDK
- `@supabase/supabase-js` - Supabase client (for storage only)

---

## Step 6: Run the Application

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

---

## Firestore Collections Schema

### artists
```javascript
{
  name: string,
  bio: string | null,
  imageUrl: string | null,
  verified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### albums
```javascript
{
  title: string,
  artistId: string,
  artistName: string,
  coverUrl: string | null,
  trackCount: number,
  featured: boolean,
  releaseDate: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### songs
```javascript
{
  title: string,
  artistId: string,
  artistName: string,
  albumId: string | null,
  audioUrl: string,
  coverUrl: string | null,
  duration: number | null,
  isDownloadable: boolean,
  featured: boolean,
  playCount: number,
  downloadCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### genres
```javascript
{
  name: string,
  createdAt: timestamp
}
```

### song_genres
```javascript
{
  songId: string,
  genreId: string,
  createdAt: timestamp
}
```

### user_profiles
```javascript
{
  userId: string,
  email: string,
  username: string,
  avatarUrl: string | null,
  isCreator: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### likes
```javascript
{
  userId: string,
  songId: string,
  createdAt: timestamp
}
```

### downloads
```javascript
{
  songId: string,
  userId: string | null,
  ipAddress: string | null,
  downloadedAt: timestamp
}
```

### song_plays
```javascript
{
  songId: string,
  userId: string | null,
  ipAddress: string | null,
  playedAt: timestamp
}
```

### admin_users
```javascript
{
  email: string,
  is_super_admin: boolean,
  createdAt: timestamp
}
```

---

## Troubleshooting

### Storage Upload Fails

1. Check that buckets are created in Supabase
2. Verify storage policies allow authenticated uploads
3. Ensure Supabase credentials are correct in `.env`

### Database Connection Fails

1. Verify Firebase project is set up correctly
2. Check all Firebase config values in `.env`
3. Ensure Firestore is created and rules are set

### Authentication Issues

1. Make sure Email/Password auth is enabled in Firebase
2. Check Firestore security rules allow reads
3. Verify admin user exists in both Auth and Firestore

---

## Migration from Supabase (If Applicable)

If you're migrating from a Supabase-only setup:

1. Export data from Supabase tables
2. Transform to Firestore format
3. Import using Firebase Admin SDK or manual entry
4. Download files from Supabase storage
5. Upload to Supabase storage (same bucket structure)
6. Update file URLs in Firestore documents

---

## Next Steps

- Set up Firebase Cloud Messaging for push notifications
- Configure Firebase Analytics
- Set up Supabase edge functions for advanced features
- Implement rate limiting and security monitoring
