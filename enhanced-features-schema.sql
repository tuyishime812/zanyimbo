-- DGT Sounds - Enhanced Features Schema
-- Run this in your Supabase SQL Editor to add new features

-- ============================================
-- NEW TABLES FOR ENHANCED FEATURES
-- ============================================

-- User Favorites (Likes) - Enhanced version
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Playlists
CREATE TABLE IF NOT EXISTS playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url VARCHAR(500),
  is_public BOOLEAN DEFAULT TRUE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist Songs (junction table)
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- Song Lyrics
CREATE TABLE IF NOT EXISTS song_lyrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE UNIQUE NOT NULL,
  lyrics TEXT NOT NULL,
  language VARCHAR(50) DEFAULT 'en',
  is_synced BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments/Reviews
CREATE TABLE IF NOT EXISTS song_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES song_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment Likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES song_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Artist Profiles (Enhanced)
CREATE TABLE IF NOT EXISTS artist_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT,
  birth_date DATE,
  origin_country VARCHAR(100),
  social_twitter VARCHAR(255),
  social_instagram VARCHAR(255),
  social_facebook VARCHAR(255),
  social_youtube VARCHAR(255),
  social_tiktok VARCHAR(255),
  website_url VARCHAR(255),
  monthly_listeners INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'play', 'like', 'download', 'share', 'comment'
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'new_song', 'new_album', 'comment', 'like', 'follow'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  reference_id UUID, -- ID of related song/album/comment
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow System
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Artist Follows
CREATE TABLE IF NOT EXISTS artist_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, artist_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_song_id ON user_favorites(song_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_song_lyrics_song_id ON song_lyrics(song_id);
CREATE INDEX IF NOT EXISTS idx_song_comments_song_id ON song_comments(song_id);
CREATE INDEX IF NOT EXISTS idx_song_comments_user_id ON song_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_artist_id ON artist_profiles(artist_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_artist_follows_user_id ON artist_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_follows_artist_id ON artist_follows(artist_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- User Favorites
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all favorites"
  ON user_favorites FOR SELECT
  USING (true);
CREATE POLICY "Users can manage own favorites"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id);

-- Playlists
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public playlists visible to all"
  ON playlists FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage own playlists"
  ON playlists FOR ALL
  USING (auth.uid() = user_id);

-- Playlist Songs
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view playlist songs from public playlists"
  ON playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id = auth.uid())
    )
  );
CREATE POLICY "Users can manage own playlist songs"
  ON playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Song Lyrics
ALTER TABLE song_lyrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lyrics"
  ON song_lyrics FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage lyrics"
  ON song_lyrics FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Comments
ALTER TABLE song_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments"
  ON song_comments FOR SELECT
  USING (true);
CREATE POLICY "Authenticated users can create comments"
  ON song_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments"
  ON song_comments FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments"
  ON song_comments FOR DELETE
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all comments"
  ON song_comments FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Comment Likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);
CREATE POLICY "Users can manage own comment likes"
  ON comment_likes FOR ALL
  USING (auth.uid() = user_id);

-- Artist Profiles
ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view artist profiles"
  ON artist_profiles FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage artist profiles"
  ON artist_profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- User Activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- User Follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view follows"
  ON user_follows FOR SELECT
  USING (true);
CREATE POLICY "Users can manage own follows"
  ON user_follows FOR ALL
  USING (auth.uid() = follower_id);

-- Artist Follows
ALTER TABLE artist_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view artist follows"
  ON artist_follows FOR SELECT
  USING (true);
CREATE POLICY "Users can manage own artist follows"
  ON artist_follows FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamps
CREATE TRIGGER update_playlists_updated_at 
  BEFORE UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_lyrics_updated_at 
  BEFORE UPDATE ON song_lyrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_comments_updated_at 
  BEFORE UPDATE ON song_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_profiles_updated_at 
  BEFORE UPDATE ON artist_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update comment edited flag
CREATE OR REPLACE FUNCTION mark_comment_edited()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_edited = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_edited_flag 
  BEFORE UPDATE ON song_comments
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION mark_comment_edited();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get user's favorite songs
CREATE OR REPLACE FUNCTION get_user_favorites(uid UUID)
RETURNS TABLE (
  song_id UUID,
  title VARCHAR(255),
  artist_id UUID,
  cover_url VARCHAR(500),
  duration INTEGER,
  favorited_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.artist_id,
    s.cover_url,
    s.duration,
    uf.created_at
  FROM songs s
  INNER JOIN user_favorites uf ON s.id = uf.song_id
  WHERE uf.user_id = uid
  ORDER BY uf.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get playlist with songs
CREATE OR REPLACE FUNCTION get_playlist_with_songs(pid UUID)
RETURNS TABLE (
  playlist_id UUID,
  name VARCHAR(255),
  description TEXT,
  cover_url VARCHAR(500),
  song_id UUID,
  song_title VARCHAR(255),
  song_cover VARCHAR(500),
  song_duration INTEGER,
  position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.cover_url,
    s.id,
    s.title,
    s.cover_url,
    s.duration,
    ps.position
  FROM playlists p
  LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
  LEFT JOIN songs s ON ps.song_id = s.id
  WHERE p.id = pid
  ORDER BY ps.position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get song with lyrics
CREATE OR REPLACE FUNCTION get_song_with_lyrics(sid UUID)
RETURNS TABLE (
  song_id UUID,
  title VARCHAR(255),
  lyrics TEXT,
  language VARCHAR(50),
  is_synced BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    sl.lyrics,
    sl.language,
    sl.is_synced
  FROM songs s
  LEFT JOIN song_lyrics sl ON s.id = sl.song_id
  WHERE s.id = sid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get song comments with user info
CREATE OR REPLACE FUNCTION get_song_comments_with_users(sid UUID)
RETURNS TABLE (
  comment_id UUID,
  parent_id UUID,
  content TEXT,
  rating INTEGER,
  is_edited BOOLEAN,
  created_at TIMESTAMP,
  user_email VARCHAR(255),
  like_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.parent_id,
    c.content,
    c.rating,
    c.is_edited,
    c.created_at,
    u.email,
    (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) as like_count
  FROM song_comments c
  INNER JOIN auth.users u ON c.user_id = u.id
  WHERE c.song_id = sid
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE user_favorites;
ALTER PUBLICATION supabase_realtime ADD TABLE playlists;
ALTER PUBLICATION supabase_realtime ADD TABLE playlist_songs;
ALTER PUBLICATION supabase_realtime ADD TABLE song_lyrics;
ALTER PUBLICATION supabase_realtime ADD TABLE song_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE comment_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE artist_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert sample artist profiles
INSERT INTO artist_profiles (artist_id, bio, origin_country, social_twitter, social_instagram)
SELECT 
  a.id,
  COALESCE(a.bio, 'Artist profile'),
  'Nigeria',
  '@artist',
  '@artist'
FROM artists a
WHERE NOT EXISTS (
  SELECT 1 FROM artist_profiles ap WHERE ap.artist_id = a.id
);
