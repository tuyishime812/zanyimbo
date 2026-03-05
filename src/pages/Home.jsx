import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import PlatformFeatures from '../components/PlatformFeatures'
import Carousel from '../components/Carousel'
import AlbumCard from '../components/AlbumCard'
import SongCard from '../components/SongCard'
import './Home.css'

export default function Home({ onPlaySong }) {
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    try {
      // Fetch featured albums
      const { data: albumsData } = await supabase
        .from('albums')
        .select(`
          *,
          artists (name)
        `)
        .order('created_at', { ascending: false })
        .limit(8)

      if (albumsData) {
        setAlbums(albumsData.map(album => ({
          id: album.id,
          title: album.title,
          artist: album.artists?.name || 'Unknown Artist',
          coverUrl: album.cover_url,
          trackCount: album.track_count,
          featured: album.featured ? 1 : null
        })))
      }

      // Fetch featured songs
      const { data: songsData } = await supabase
        .from('songs')
        .select(`
          *,
          artists (name)
        `)
        .order('created_at', { ascending: false })
        .limit(8)

      if (songsData) {
        setSongs(songsData.map(song => ({
          id: song.id,
          title: song.title,
          artist: song.artists?.name || 'Unknown Artist',
          coverUrl: song.cover_url,
          duration: song.duration,
          audioUrl: song.audio_url
        })))
      }
    } catch (error) {
      console.error('Error fetching music:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAlbum = () => {
    // Find first song from this album
    const albumSong = songs[0]
    if (albumSong) {
      onPlaySong(albumSong)
    }
  }

  const handlePlaySong = (song) => {
    onPlaySong(song)
  }

  return (
    <div className="home">
      <Hero />
      <PlatformFeatures />
      
      {albums.length > 0 && (
        <Carousel title="Curated Albums" badge="EXCLUSIVE">
          {albums.map((album) => (
            <AlbumCard 
              key={album.id} 
              album={album} 
              onPlay={handlePlayAlbum}
            />
          ))}
        </Carousel>
      )}

      {songs.length > 0 && (
        <Carousel title="Curated Singles" badge="EXCLUSIVE">
          {songs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              onPlay={handlePlaySong}
            />
          ))}
        </Carousel>
      )}

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading music...</p>
        </div>
      )}

      {!loading && albums.length === 0 && songs.length === 0 && (
        <div className="no-content">
          <h2>No Music Yet</h2>
          <p>Check back soon for the latest African music!</p>
        </div>
      )}
    </div>
  )
}
