import { useState, useEffect } from 'react'
import { albumsService, songsService } from '../lib/supabaseDatabase'
import Hero from '../components/Hero'
import PlatformFeatures from '../components/PlatformFeatures'
import AlbumCard from '../components/AlbumCard'
import SongCard from '../components/SongCard'
import Ad from '../components/Ad'
import './Home.css'

export default function Home({ onPlaySong }) {
  const [albums, setAlbums] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMusic()

    // Realtime subscriptions using Supabase
    const unsubscribeAlbums = albumsService.subscribe((updatedAlbums) => {
      setAlbums(updatedAlbums)
    })

    const unsubscribeSongs = songsService.subscribe((updatedSongs) => {
      setTopSongs(updatedSongs)
    })

    return () => {
      unsubscribeAlbums()
      unsubscribeSongs()
    }
  }, [])

  const fetchMusic = async () => {
    try {
      // Fetch featured albums
      const albumsData = await albumsService.getAll()
      
      if (albumsData) {
        setAlbums(albumsData.slice(0, 8).map(album => ({
          id: album.id,
          title: album.title,
          artist: album.artistName || 'Unknown Artist',
          coverUrl: album.coverUrl,
          trackCount: album.trackCount,
          featured: album.featured ? 1 : null,
          artistId: album.artistId
        })))
      }

      // Fetch most streamed and downloaded songs
      const songsData = await songsService.getAll()
      
      if (songsData) {
        // Sort by play count for trending
        const sortedSongs = songsData.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        setTopSongs(sortedSongs.slice(0, 20).map(song => ({
          id: song.id,
          title: song.title,
          artist: song.artistName || 'Unknown Artist',
          coverUrl: song.coverUrl,
          duration: song.duration,
          audioUrl: song.audioUrl,
          playCount: song.playCount || 0,
          downloadCount: song.downloadCount || 0,
          artistId: song.artistId,
          albumId: song.albumId
        })))
      }
    } catch (error) {
      console.error('Error fetching music:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAlbum = (album) => {
    // Find first song from this album
    const albumSong = topSongs.find(s => s.albumId === album.id) || topSongs[0]
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

      {/* Ad After Features */}
      <Ad />

      {/* Albums Section - Direct Grid */}
      {albums.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Latest Albums</h2>
            <span className="badge badge-exclusive">EXCLUSIVE</span>
          </div>
          <div className="albums-grid-direct">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={handlePlayAlbum}
              />
            ))}
          </div>
        </section>
      )}

      {/* Songs Section - Direct Grid */}
      {topSongs.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Trending Songs</h2>
            <span className="badge badge-hot">HOT</span>
          </div>
          <div className="songs-grid-direct">
            {topSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
              />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading music...</p>
        </div>
      )}

      {!loading && albums.length === 0 && topSongs.length === 0 && (
        <div className="no-content">
          <h2>No Music Yet</h2>
          <p>Check back soon for the latest African music!</p>
        </div>
      )}
    </div>
  )
}
