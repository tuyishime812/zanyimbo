# 🎵 Content Population Guide - DGT Sounds

This guide walks you through adding real content to your music streaming platform.

---

## 📋 Content Addition Order

**Important:** Add content in this specific order to avoid errors:

1. **Artists** → 2. **Albums** → 3. **Songs**

---

## 🎤 Step 1: Add Artists

### Via Admin Panel (Recommended)

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Login as admin:**
   - Go to `http://localhost:5173/login`
   - Login with your admin account

3. **Navigate to Artists:**
   - Go to `http://localhost:5173/admin/artists`
   - Or click **Artists** in the admin sidebar

4. **Add Your First Artist:**
   - Click **"+ Add Artist"** button
   - Fill in the form:
     - **Artist Name**: e.g., "Sauti Sol"
     - **Bio**: e.g., "Kenyan Afro-pop band formed in 2005..."
     - **Artist Image**: Upload a photo (optional)
     - **Verified**: Check if the artist is verified
   - Click **"Create"**

### Sample African Artists to Add

Here are some popular African artists you can add:

| Artist Name | Bio | Verified |
|-------------|-----|----------|
| **Sauti Sol** | Kenyan Afro-pop band from Nairobi, formed in 2005. Known for hits like "Suzanna" and "Melanin". | ✅ |
| **Burna Boy** | Nigerian Afro-fusion singer and songwriter. Grammy Award winner known for "African Giant". | ✅ |
| **Wizkid** | Nigerian Afrobeats superstar. International hits include "Essence" and "One Dance". | ✅ |
| **Diamond Platnumz** | Tanzanian Bongo Flava artist. One of East Africa's biggest music stars. | ✅ |
| **Master KG** | South African musician and producer. Creator of the global hit "Jerusalema". | ✅ |
| **Nadia Mukami** | Kenyan singer-songwriter known for contemporary R&B and Afro-pop. | ✅ |
| **Harmonize** | Tanzanian Afrobeat artist, former Wasafi Classic Baby member. | ✅ |
| **Koffi Olomide** | Congolese soukous legend with over 40 years in music. | ✅ |
| **Yemi Alade** | Nigerian Afropop singer known for "Johnny" and powerful performances. | ✅ |
| **Fally Ipupa** | Congolese R&B and soukous singer, dancer and songwriter. | ✅ |

---

## 💿 Step 2: Add Albums

### Via Admin Panel

1. **Navigate to Albums:**
   - Go to `http://localhost:5173/admin/albums`

2. **Add Your First Album:**
   - Click **"+ Add Album"** button
   - Fill in the form:
     - **Album Title**: e.g., "African Giant"
     - **Artist Name**: Type the artist name (must exist from Step 1)
     - **Cover Image**: Upload album artwork (recommended: 1000x1000px)
     - **Release Date**: Select release date
     - **Featured**: Check if featured album
   - Click **"Create"**

### Sample Albums to Add

| Album Title | Artist | Release Date | Featured |
|-------------|--------|--------------|----------|
| **African Giant** | Burna Boy | 2019-07-26 | ✅ |
| **Made in Lagos** | Wizkid | 2020-10-30 | ✅ |
| **Midnight Train** | Sauti Sol | 2020-10-02 | ✅ |
| **A Boy from Tandale** | Diamond Platnumz | 2022-06-03 | ✅ |
| **Rumbidzai** | Master KG | 2021-09-17 | ❌ |
| **No Filter** | Nadia Mukami | 2021-11-12 | ❌ |
| **Highly Favoured** | Harmonize | 2022-08-26 | ❌ |
| **Altecole** | Fally Ipupa | 2022-06-10 | ✅ |
| **Mama Africa** | Yemi Alade | 2022-09-09 | ❌ |
| **Love & War** | Koffi Olomide | 2020-12-04 | ❌ |

---

## 🎵 Step 3: Add Songs

### Via Admin Panel

1. **Navigate to Songs:**
   - Go to `http://localhost:5173/admin/songs`

2. **Add Your First Song:**
   - Click **"+ Add Song"** button
   - Fill in the form:
     - **Title**: e.g., "Last Last"
     - **Artist Name**: Type artist name (will auto-create if doesn't exist)
     - **Album Name**: Optional - select existing album
     - **Audio File**: Upload MP3/WAV file (required)
     - **Cover Image**: Upload song cover (optional)
     - **Duration**: Enter duration in seconds (e.g., 180 = 3:00)
     - **Genre**: Select from dropdown (if available)
     - **Allow Download**: Check to enable downloads
     - **Featured**: Check to feature on homepage
   - Click **"Create"**

### Sample Songs to Add

| Title | Artist | Album | Duration (sec) | Featured | Downloadable |
|-------|--------|-------|----------------|----------|--------------|
| **Last Last** | Burna Boy | Love, Damini | 162 | ✅ | ✅ |
| **Essence** | Wizkid | Made in Lagos | 244 | ✅ | ✅ |
| **Suzanna** | Sauti Sol | Midnight Train | 198 | ✅ | ✅ |
| **Jerusalema** | Master KG | Jerusalema | 213 | ✅ | ✅ |
| **Penelope** | Diamond Platnumz | A Boy from Tandale | 189 | ✅ | ✅ |
| **Wangu** | Nadia Mukami | No Filter | 176 | ❌ | ✅ |
| **More Time** | Harmonize | Highly Favoured | 201 | ❌ | ✅ |
| **Dancefloor** | Fally Ipupa | Altecole | 185 | ❌ | ✅ |
| **Johnny** | Yemi Alade | Mama Africa | 219 | ✅ | ✅ |
| **Droit Chemin** | Koffi Olomide | Haute Ecole | 267 | ❌ | ✅ |

---

## 🎨 File Upload Tips

### Audio Files
- **Format**: MP3, WAV, AAC, OGG
- **Quality**: 320kbps MP3 or higher recommended
- **Size**: Max 50MB per file (Supabase default)
- **Naming**: Use descriptive names (e.g., `burna-boy-last-last.mp3`)

### Cover Images
- **Format**: JPG, PNG, WebP
- **Size**: Square images work best (1000x1000px recommended)
- **File Size**: Keep under 5MB for faster loading
- **Quality**: High resolution for retina displays

### Artist Images
- **Format**: JPG, PNG
- **Size**: 500x500px or larger
- **Aspect Ratio**: Square works best for cards

---

## 📊 Content Checklist

### Before Going Live

- [ ] At least 10 artists added
- [ ] At least 20 albums created
- [ ] At least 50 songs uploaded
- [ ] All songs have cover art
- [ ] All artists have bios
- [ ] Featured songs marked appropriately
- [ ] Download permissions set correctly
- [ ] Genres assigned to songs
- [ ] All audio files tested (play correctly)
- [ ] All images display properly

---

## 🔧 Troubleshooting

### "Artist doesn't exist" error when adding album
**Solution:** Add the artist first in the Artists section, then add the album.

### File upload fails
**Solutions:**
- Check file size (must be under 50MB)
- Verify internet connection
- Check Supabase storage buckets exist (`music` and `covers`)
- Ensure you're logged in as admin

### Song doesn't appear on homepage
**Solution:** Mark the song as "Featured" when editing.

### Audio doesn't play
**Solutions:**
- Check audio file format (use MP3 for best compatibility)
- Verify the audio URL is correct
- Test in different browsers
- Check browser console for errors

---

## 🚀 Quick Population Script (Optional)

If you want to add sample data programmatically, you can use the Supabase Dashboard:

1. Go to **SQL Editor** in Supabase
2. Run INSERT statements for sample data

Example:
```sql
-- Insert sample artists
INSERT INTO artists (name, bio, verified, image_url)
VALUES 
  ('Sauti Sol', 'Kenyan Afro-pop band formed in 2005', true, NULL),
  ('Burna Boy', 'Nigerian Afro-fusion singer and songwriter', true, NULL),
  ('Wizkid', 'Nigerian Afrobeats superstar', true, NULL);
```

---

## 📈 Content Strategy Tips

### For Launch
1. **Start with 50+ songs** from various African artists
2. **Include multiple genres**: Afrobeat, Afropop, Soukous, Bongo Flava, Amapiano
3. **Add artist bios** to make profiles complete
4. **Use high-quality cover art** for professional look
5. **Feature top tracks** on the homepage

### Ongoing
- Add new releases weekly
- Update artist profiles with latest info
- Feature trending songs
- Add exclusive content regularly

---

## 🎯 Next Steps After Content Population

1. **Test the user experience:**
   - Browse music as a regular user
   - Test search functionality
   - Play songs and check player controls
   - Test download feature

2. **Optimize for performance:**
   - Ensure images are optimized
   - Check page load times
   - Test on mobile devices

3. **Prepare for launch:**
   - Set up Google Analytics
   - Add SEO meta tags
   - Test all pages
   - Deploy to production

---

**Need help?** Check the `ADMIN_SETUP.md` for admin panel troubleshooting.

**Built with ❤️ for African Music**
© 2026 DGT Sounds Multimedia
