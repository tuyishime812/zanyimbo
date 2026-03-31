import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { likesService, songPlaysService, downloadsService } from '../lib/supabaseDatabase'

const MusicContext = createContext({})

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [likedSongs, setLikedSongs] = useState([])
  const [user, setUser] = useState(null)

  const fetchLikedSongs = async (userId) => {
    try {
      const likes = await likesService.getByUser(userId)
      setLikedSongs(likes.map(l => l.song_id))
    } catch (error) {
      console.error('Error fetching liked songs:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const supabaseUser = session?.user
      setUser(supabaseUser)
      if (supabaseUser) {
        await fetchLikedSongs(supabaseUser.id)
      } else {
        setLikedSongs([])
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const supabaseUser = session?.user
      setUser(supabaseUser)
      if (supabaseUser) {
        await fetchLikedSongs(supabaseUser.id)
      } else {
        setLikedSongs([])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const playSong = (song, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue)
      const index = newQueue.findIndex(s => s.id === song.id)
      setQueueIndex(index)
    } else if (queue.length === 0) {
      setQueue([song])
      setQueueIndex(0)
    }

    setCurrentSong(song)
    setIsPlaying(true)

    // Track play
    trackPlay(song.id)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (queue.length === 0) return

    const nextIndex = queueIndex + 1
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex)
      setCurrentSong(queue[nextIndex])
      setIsPlaying(true)
      trackPlay(queue[nextIndex].id)
    }
  }

  const playPrevious = () => {
    if (queue.length === 0) return

    const prevIndex = queueIndex - 1
    if (prevIndex >= 0) {
      setQueueIndex(prevIndex)
      setCurrentSong(queue[prevIndex])
      setIsPlaying(true)
      trackPlay(queue[prevIndex].id)
    }
  }

  const addToQueue = (song) => {
    setQueue([...queue, song])
  }

  const clearQueue = () => {
    setQueue([])
    setQueueIndex(-1)
    setCurrentSong(null)
    setIsPlaying(false)
  }

  const trackPlay = async (songId) => {
    try {
      await songPlaysService.track(songId, user?.id || null)
    } catch (error) {
      console.error('Error tracking play:', error)
    }
  }

  const toggleLike = async (songId) => {
    if (!user) {
      console.warn('User must be logged in to like songs')
      return
    }

    const isLiked = likedSongs.includes(songId)

    try {
      if (isLiked) {
        await likesService.remove(user.id, songId)
        setLikedSongs(likedSongs.filter(id => id !== songId))
      } else {
        await likesService.add(user.id, songId)
        setLikedSongs([...likedSongs, songId])
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const isLiked = (songId) => {
    return likedSongs.includes(songId)
  }

  const value = {
    currentSong,
    isPlaying,
    queue,
    queueIndex,
    likedSongs,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious,
    addToQueue,
    clearQueue,
    toggleLike,
    isLiked,
    user
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}
