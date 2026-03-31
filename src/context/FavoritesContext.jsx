import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext({})

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { showToast } = useToast()

  // Load user favorites
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          songs (
            id,
            title,
            artist_id,
            cover_url,
            duration,
            audio_url,
            artists (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        // Table doesn't exist yet - ignore error
        if (error.code === 'PGRST205') {
          setFavorites([])
          return
        }
        throw error
      }
      setFavorites(data || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
      if (showToast) showToast('Failed to load favorites', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Load user playlists
  const loadPlaylists = async () => {
    if (!user) {
      setPlaylists([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        // Table doesn't exist yet - ignore error
        if (error.code === 'PGRST205') {
          setPlaylists([])
          return
        }
        throw error
      }
      setPlaylists(data || [])
    } catch (error) {
      console.error('Error loading playlists:', error)
    }
  }

  // Add to favorites
  const addToFavorites = async (songId) => {
    if (!user) {
      if (showToast) showToast('Please login to add favorites', 'warning')
      return false
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          song_id: songId
        })

      if (error) {
        if (error.code === '23505') {
          if (showToast) showToast('Already in favorites', 'info')
        } else {
          throw error
        }
      } else {
        if (showToast) showToast('Added to favorites', 'success')
        await loadFavorites()
      }
      return true
    } catch (error) {
      console.error('Error adding to favorites:', error)
      if (showToast) showToast('Failed to add to favorites', 'error')
      return false
    }
  }

  // Remove from favorites
  const removeFromFavorites = async (songId) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId)

      if (error) throw error

      if (showToast) showToast('Removed from favorites', 'success')
      await loadFavorites()
      return true
    } catch (error) {
      console.error('Error removing from favorites:', error)
      if (showToast) showToast('Failed to remove from favorites', 'error')
      return false
    }
  }

  // Check if song is favorite
  const isFavorite = (songId) => {
    return favorites.some(fav => fav.song_id === songId)
  }

  // Toggle favorite
  const toggleFavorite = async (songId) => {
    if (isFavorite(songId)) {
      return await removeFromFavorites(songId)
    } else {
      return await addToFavorites(songId)
    }
  }

  // Create playlist
  const createPlaylist = async (name, description = '', isPublic = true) => {
    if (!user) {
      if (showToast) showToast('Please login to create playlists', 'warning')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          name,
          description,
          is_public: isPublic
        })
        .select()
        .single()

      if (error) throw error

      if (showToast) showToast('Playlist created', 'success')
      await loadPlaylists()
      return data
    } catch (error) {
      console.error('Error creating playlist:', error)
      if (showToast) showToast('Failed to create playlist', 'error')
      return null
    }
  }

  // Delete playlist
  const deletePlaylist = async (playlistId) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', user.id)

      if (error) throw error

      if (showToast) showToast('Playlist deleted', 'success')
      await loadPlaylists()
      return true
    } catch (error) {
      console.error('Error deleting playlist:', error)
      if (showToast) showToast('Failed to delete playlist', 'error')
      return false
    }
  }

  // Add song to playlist
  const addToPlaylist = async (playlistId, songId) => {
    if (!user) return false

    try {
      // Get current max position
      const { data: existing } = await supabase
        .from('playlist_songs')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)

      const newPosition = ((existing && existing[0]?.position) || 0) + 1

      const { error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: playlistId,
          song_id: songId,
          position: newPosition
        })

      if (error) {
        if (error.code === '23505') {
          if (showToast) showToast('Song already in playlist', 'info')
        } else {
          throw error
        }
      } else {
        if (showToast) showToast('Added to playlist', 'success')
      }
      return true
    } catch (error) {
      console.error('Error adding to playlist:', error)
      if (showToast) showToast('Failed to add to playlist', 'error')
      return false
    }
  }

  // Remove song from playlist
  const removeFromPlaylist = async (playlistId, songId) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId)

      if (error) throw error

      if (showToast) showToast('Removed from playlist', 'success')
      return true
    } catch (error) {
      console.error('Error removing from playlist:', error)
      if (showToast) showToast('Failed to remove from playlist', 'error')
      return false
    }
  }

  // Load playlist songs
  const loadPlaylistSongs = async (playlistId) => {
    try {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select(`
          *,
          songs (
            id,
            title,
            artist_id,
            cover_url,
            duration,
            audio_url,
            artists (
              name
            )
          )
        `)
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error loading playlist songs:', error)
      return []
    }
  }

  // Update playlist
  const updatePlaylist = async (playlistId, updates) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', playlistId)
        .eq('user_id', user.id)

      if (error) throw error

      if (showToast) showToast('Playlist updated', 'success')
      await loadPlaylists()
      return true
    } catch (error) {
      console.error('Error updating playlist:', error)
      if (showToast) showToast('Failed to update playlist', 'error')
      return false
    }
  }

  useEffect(() => {
    loadFavorites()
    loadPlaylists()
  }, [user])

  const value = {
    favorites,
    playlists,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    loadPlaylistSongs,
    updatePlaylist,
    refreshFavorites: loadFavorites,
    refreshPlaylists: loadPlaylists
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
