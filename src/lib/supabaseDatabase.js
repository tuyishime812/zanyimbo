import { supabase } from './supabase'

/**
 * Supabase Database Service
 * Replaces Firebase Firestore with Supabase PostgreSQL
 */

// Collection names -> Table names
export const TABLES = {
  ARTISTS: 'artists',
  ALBUMS: 'albums',
  SONGS: 'songs',
  CATEGORIES: 'categories',
  GENRES: 'genres',
  SONG_GENRES: 'song_genres',
  USER_PROFILES: 'user_profiles',
  LIKES: 'likes',
  DOWNLOADS: 'downloads',
  SONG_PLAYS: 'song_plays',
  ADMIN_USERS: 'admin_users'
}

/**
 * Artists Service
 */
export const artistsService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.ARTISTS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.ARTISTS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.ARTISTS)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.ARTISTS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.ARTISTS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  subscribe(callback) {
    const channel = supabase
      .channel('artists')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.ARTISTS }, async () => {
        const artists = await this.getAll()
        callback(artists)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }
}

/**
 * Albums Service
 */
export const albumsService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.ALBUMS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.ALBUMS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  async getByArtist(artistId) {
    const { data, error } = await supabase
      .from(TABLES.ALBUMS)
      .select('*')
      .eq('artist_id', artistId)
    
    if (error) throw error
    return data || []
  },

  async getFeatured(limitCount = 6) {
    const { data, error } = await supabase
      .from(TABLES.ALBUMS)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limitCount)
    
    if (error) throw error
    return data || []
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.ALBUMS)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.ALBUMS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.ALBUMS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  subscribe(callback) {
    const channel = supabase
      .channel('albums')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.ALBUMS }, async () => {
        const albums = await this.getAll()
        callback(albums)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }
}

/**
 * Songs Service
 */
export const songsService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  async getByArtist(artistId) {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .eq('artist_id', artistId)
    
    if (error) throw error
    return data || []
  },

  async getByAlbum(albumId) {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .eq('album_id', albumId)
    
    if (error) throw error
    return data || []
  },

  async getFeatured(limitCount = 10) {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limitCount)
    
    if (error) throw error
    return data || []
  },

  async search(queryText) {
    const { data, error } = await supabase
      .from(TABLES.SONGS)
      .select('*')
      .ilike('title', `%${queryText}%`)
    
    if (error) throw error
    return data || []
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.SONGS)
      .insert({
        ...data,
        searchable: data.title.toLowerCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.SONGS)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.SONGS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async incrementPlayCount(songId) {
    const { error } = await supabase.rpc('increment_play_count', { song_id: songId })
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: song } = await this.getById(songId)
      if (song) {
        await this.update(songId, { play_count: (song.play_count || 0) + 1 })
      }
    }
  },

  async incrementDownloadCount(songId) {
    const { error } = await supabase.rpc('increment_download_count', { song_id: songId })
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: song } = await this.getById(songId)
      if (song) {
        await this.update(songId, { download_count: (song.download_count || 0) + 1 })
      }
    }
  },

  subscribe(callback) {
    const channel = supabase
      .channel('songs')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.SONGS }, async () => {
        const songs = await this.getAll()
        callback(songs)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }
}

/**
 * Genres Service
 */
export const genresService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.GENRES)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.GENRES)
      .insert({
        ...data,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.GENRES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

/**
 * Song Genres Service (Junction)
 */
export const songGenresService = {
  async getBySong(songId) {
    const { data, error } = await supabase
      .from(TABLES.SONG_GENRES)
      .select('*')
      .eq('song_id', songId)
    
    if (error) throw error
    return data || []
  },

  async getByGenre(genreId) {
    const { data, error } = await supabase
      .from(TABLES.SONG_GENRES)
      .select('*')
      .eq('genre_id', genreId)
    
    if (error) throw error
    return data || []
  },

  async add(songId, genreId) {
    const { data: result, error } = await supabase
      .from(TABLES.SONG_GENRES)
      .insert({
        song_id: songId,
        genre_id: genreId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async remove(songId, genreId) {
    const { error } = await supabase
      .from(TABLES.SONG_GENRES)
      .delete()
      .eq('song_id', songId)
      .eq('genre_id', genreId)
    
    if (error) throw error
  }
}

/**
 * Categories Service
 */
export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert({
        ...data,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .update(data)
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

/**
 * User Profiles Service
 */
export const userProfilesService = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) return null
    return data
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.USER_PROFILES)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.USER_PROFILES)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  }
}

/**
 * Likes Service
 */
export const likesService = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.LIKES)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async isLiked(userId, songId) {
    const { data, error } = await supabase
      .from(TABLES.LIKES)
      .select('id')
      .eq('user_id', userId)
      .eq('song_id', songId)
      .limit(1)
    
    if (error) return false
    return data && data.length > 0
  },

  async add(userId, songId) {
    const { data: result, error } = await supabase
      .from(TABLES.LIKES)
      .insert({
        user_id: userId,
        song_id: songId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async remove(userId, songId) {
    const { error } = await supabase
      .from(TABLES.LIKES)
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId)
    
    if (error) throw error
  }
}

/**
 * Downloads Service
 */
export const downloadsService = {
  async track(songId, userId, ipAddress = null) {
    const { error } = await supabase
      .from(TABLES.DOWNLOADS)
      .insert({
        song_id: songId,
        user_id: userId,
        ip_address: ipAddress,
        downloaded_at: new Date().toISOString()
      })
    
    if (error) throw error
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.DOWNLOADS)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async getBySong(songId) {
    const { data, error } = await supabase
      .from(TABLES.DOWNLOADS)
      .select('*')
      .eq('song_id', songId)
    
    if (error) throw error
    return data || []
  }
}

/**
 * Song Plays Service
 */
export const songPlaysService = {
  async track(songId, userId, ipAddress = null) {
    const { error } = await supabase
      .from(TABLES.SONG_PLAYS)
      .insert({
        song_id: songId,
        user_id: userId,
        played_at: new Date().toISOString(),
        ip_address: ipAddress
      })
    
    if (error) throw error
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.SONG_PLAYS)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async getBySong(songId) {
    const { data, error } = await supabase
      .from(TABLES.SONG_PLAYS)
      .select('*')
      .eq('song_id', songId)
    
    if (error) throw error
    return data || []
  }
}

/**
 * Admin Users Service
 */
export const adminUsersService = {
  async getByEmail(email) {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) return null
    return data
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .insert({
        ...data,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return result.id
  },

  async update(id, data) {
    const { error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .update(data)
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

/**
 * Stats Service for Dashboard
 */
export const statsService = {
  async getDashboardStats() {
    const [songs, albums, artists, plays, downloads] = await Promise.all([
      supabase.from(TABLES.SONGS).select('id', { count: 'exact' }),
      supabase.from(TABLES.ALBUMS).select('id', { count: 'exact' }),
      supabase.from(TABLES.ARTISTS).select('id', { count: 'exact' }),
      supabase.from(TABLES.SONG_PLAYS).select('id', { count: 'exact' }),
      supabase.from(TABLES.DOWNLOADS).select('id', { count: 'exact' })
    ])

    return {
      songs: songs.count || 0,
      albums: albums.count || 0,
      artists: artists.count || 0,
      totalPlays: plays.count || 0,
      totalDownloads: downloads.count || 0
    }
  }
}
