import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { songsService, downloadsService } from '../lib/supabaseDatabase'
import { useMusic } from '../context/MusicContext'
import { Play, Download, Heart, Share2, ArrowLeft, Clock, TrendingUp } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useToast } from '../context/ToastContext'
import { downloadSongWithMetadata, simpleDownload } from '../lib/downloadUtils'
import './SongDetail.css'

export default function SongDetail() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playSong, toggleLike, isLiked } = useMusic()
  const toast = useToast()

  useEffect(() => {
    if (id) {
      fetchSong()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchSong = async () => {
    try {
      const songData = await songsService.getById(id)
      if (songData) {
        setSong(songData)
      } else {
        toast.error('Song not found')
      }
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
      artist: song.artistName || 'Unknown',
      audioUrl: song.audioUrl,
      coverUrl: song.coverUrl,
      isDownloadable: song.isDownloadable
    })
    toast.success(`Playing: ${song.title}`)
  }

  const handleShare = async () => {
    if (!song) return

    const shareUrl = `${window.location.origin}/song/${song.id}`
    const shareData = {
      title: song.title,
      text: `Check out "${song.title}" by ${song.artistName} on DGT Sounds!`,
      url: shareUrl
    }

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share error:', err)
        }
      }
    } else {
      // Fallback: Show share options
      const shareOptions = confirm(
        `Share "${song.title}" by ${song.artistName}?\n\nClick OK for WhatsApp\nClick Cancel for Facebook`
      )

      if (shareOptions) {
        // WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`
        window.open(whatsappUrl, '_blank')
      } else {
        // Facebook
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
        window.open(facebookUrl, '_blank')
      }
    }
  }

  const handleDownload = async () => {
    if (!song || !song.isDownloadable) {
      toast.error('Download not available')
      return
    }

    toast.info(`⏳ Preparing download: ${song.artistName} - ${song.title}...`)

    try {
      // Create download link with proper filename (same tab download)
      const filename = `${song.artistName} - ${song.title}.mp3`
        .replace(/[^a-z0-9\s\-\.]/gi, '_')
        .replace(/\s+/g, ' ')
        .trim()

      // Try blob download first
      try {
        const response = await fetch(song.audioUrl)
        if (!response.ok) throw new Error('Download failed')
        const blob = await response.blob()
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        setTimeout(() => window.URL.revokeObjectURL(url), 100)
        
      } catch (fetchError) {
        // Fallback: direct download (same tab)
        window.location.href = song.audioUrl
      }

      toast.success(`✅ Download started!`)

      // Track download
      await downloadsService.track(song.id, null)
    } catch (e) {
      console.error('Download error:', e)
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
              src={song.coverUrl || 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'}
              alt={song.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'
              }}
            />
          </div>

          <div className="song-info-large">
            <h1 className="song-title-large">{song.title}</h1>
            <p className="artist-name">{song.artistName || 'Unknown Artist'}</p>

            {song.albumName && (
              <p className="album-name">Album: {song.albumName}</p>
            )}

            <div className="song-stats">
              <div className="stat">
                <Play size={18} />
                <span>{song.playCount || 0} plays</span>
              </div>
              <div className="stat">
                <Download size={18} />
                <span>{song.downloadCount || 0} downloads</span>
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

              {song.isDownloadable && (
                <button className="btn-download-large" onClick={handleDownload}>
                  <Download size={24} />
                  Download
                </button>
              )}

              <button className="btn-like-large" onClick={handleLike}>
                <Heart size={24} fill={isLiked(song.id) ? '#ff6b35' : 'none'} />
              </button>

              <button className="btn-like-large" onClick={handleShare}>
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
