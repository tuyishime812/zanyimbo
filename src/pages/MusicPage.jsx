import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Filter, Grid, List, Download, Play } from 'lucide-react'
import SongCard from '../components/SongCard'
import AlbumCard from '../components/AlbumCard'
import './MusicPage.css'

const genres = ['All', 'Afrobeats', 'Hip Hop', 'R&B', 'Gospel', 'Traditional', 'Jazz', 'Amapiano', 'Afro-pop']

export default function MusicPage({ onPlaySong }) {
  const [view, setView] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    try {
      const { data: songsData } = await supabase
        .from('songs')
        .select(`*, artists(name)`)
        .order('created_at', { ascending: false })

      if (songsData) {
        setSongs(songsData.map(s => ({
          id: s.id,
          title: s.title,
          artist: s.artists?.name || 'Unknown',
          coverUrl: s.cover_url,
          duration: s.duration,
          audioUrl: s.audio_url,
          is_downloadable: s.is_downloadable
        })))
      }

      const { data: albumsData } = await supabase
        .from('albums')
        .select(`*, artists(name)`)
        .order('created_at', { ascending: false })

      if (albumsData) {
        setAlbums(albumsData.map(a => ({
          id: a.id,
          title: a.title,
          artist: a.artists?.name || 'Unknown',
          coverUrl: a.cover_url,
          trackCount: a.track_count
        })))
      }
    } catch (error) {
      console.error('Error fetching music:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (song) => {
    if (!song.is_downloadable) {
      alert('This song is not available for download')
      return
    }

    try {
      // Track download
      await supabase.from('downloads').insert({
        song_id: song.id
      })

      // Trigger download
      const link = document.createElement('a')
      link.href = song.audioUrl
      link.download = `${song.title} - ${song.artist}.mp3`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download song')
    }
  }

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="music-page">
      <div className="music-header">
        <h1 className="page-title">MUSIC</h1>
        <p className="page-subtitle">Stream Africa's hottest tracks</p>
      </div>

      <div className="music-toolbar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${view === 'all' ? 'active' : ''}`}
              onClick={() => setView('all')}
            >
              <Grid size={18} />
              All
            </button>
            <button 
              className={`toggle-btn ${view === 'songs' ? 'active' : ''}`}
              onClick={() => setView('songs')}
            >
              Songs
            </button>
            <button 
              className={`toggle-btn ${view === 'albums' ? 'active' : ''}`}
              onClick={() => setView('albums')}
            >
              Albums
            </button>
          </div>
        </div>
      </div>

      <div className="genre-filter">
        <Filter size={16} />
        <div className="genre-list">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="music-content">
        {loading ? (
          <div className="loading-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="loading-item"></div>
            ))}
          </div>
        ) : (
          <>
            {(view === 'all' || view === 'songs') && (
              <section className="content-section">
                <div className="section-heading-row">
                  <h2 className="section-heading">All Songs</h2>
                  <span className="item-count">{filteredSongs.length} songs</span>
                </div>
                <div className="songs-list">
                  {filteredSongs.map((song) => (
                    <div key={song.id} className="song-list-item">
                      <img 
                        src={song.coverUrl || 'https://via.placeholder.com/50'} 
                        alt={song.title}
                        className="song-list-cover"
                      />
                      <div className="song-list-info">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                      </div>
                      <span className="song-list-duration">
                        {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                      </span>
                      <div className="song-list-actions">
                        <button 
                          className="btn-icon btn-play"
                          onClick={() => onPlaySong(song)}
                          title="Play"
                        >
                          <Play size={18} fill="white" />
                        </button>
                        {song.is_downloadable && (
                          <button 
                            className="btn-icon btn-download"
                            onClick={() => handleDownload(song)}
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(view === 'all' || view === 'albums') && (
              <section className="content-section">
                <div className="section-heading-row">
                  <h2 className="section-heading">All Albums</h2>
                  <span className="item-count">{filteredAlbums.length} albums</span>
                </div>
                <div className="albums-grid">
                  {filteredAlbums.map((album) => (
                    <AlbumCard 
                      key={album.id} 
                      album={album}
                      onPlay={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredSongs.length === 0 && filteredAlbums.length === 0 && (
              <div className="no-results">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
