import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Play, Download, Heart, Share2, ArrowLeft, Clock, TrendingUp } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useToast } from '../context/ToastContext'
import './SongDetail.css'

export default function SongDetail() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playSong, toggleLike, isLiked } = useMusic()
  const toast = useToast()

  useEffect(() => {
    fetchSong()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchSong = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select(`
          *,
          artists (name),
          albums (title),
          genres (name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setSong(data)
    } catch (err) {
      console.error('Error fetching song:', err)
      toast.error('Song not found')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = () => {
    if (!song) return
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artists?.name || 'Unknown',
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      is_downloadable: song.is_downloadable
    })
    toast.success(`Playing: ${song.title}`)
  }

  const handleDownload = async () => {
    if (!song || !song.is_downloadable) {
      toast.error('Download not available')
      return
    }

    try {
      const response = await fetch(song.audio_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${song.title} - ${song.artists?.name}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch {
      toast.error('Download failed')
    }
  }

  const handleLike = () => {
    if (song) {
      toggleLike(song.id)
      toast.success(isLiked(song.id) ? 'Removed from favorites' : 'Added to favorites! ❤️')
    }
  }

  if (loading) {
    return (
      <div className="song-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading song...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!song) {
    return (
      <div className="song-detail-page">
        <Header />
        <div className="not-found">
          <h2>Song Not Found</h2>
          <Link to="/music" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Music
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="song-detail-page">
      <Header />

      <div className="song-detail-container">
        <Link to="/music" className="back-link">
          <ArrowLeft size={20} />
          Back to Music
        </Link>

        <div className="song-detail-content">
          <div className="song-cover-large">
            <img
              src={song.cover_url || 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'}
              alt={song.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'
              }}
            />
          </div>

          <div className="song-info-large">
            <h1 className="song-title-large">{song.title}</h1>
            <p className="artist-name">{song.artists?.name || 'Unknown Artist'}</p>
            
            {song.albums && (
              <p className="album-name">Album: {song.albums.title}</p>
            )}

            {song.genres && song.genres.length > 0 && (
              <div className="genre-tags">
                {song.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            )}

            <div className="song-stats">
              <div className="stat">
                <Play size={18} />
                <span>{song.play_count || 0} plays</span>
              </div>
              <div className="stat">
                <Download size={18} />
                <span>{song.download_count || 0} downloads</span>
              </div>
              {song.duration && (
                <div className="stat">
                  <Clock size={18} />
                  <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>

            <div className="song-actions-large">
              <button className="btn-play-large" onClick={handlePlay}>
                <Play size={24} fill="white" />
                Play Now
              </button>
              
              {song.is_downloadable && (
                <button className="btn-download-large" onClick={handleDownload}>
                  <Download size={24} />
                  Download
                </button>
              )}
              
              <button className="btn-like-large" onClick={handleLike}>
                <Heart size={24} fill={isLiked(song.id) ? '#ff6b35' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
