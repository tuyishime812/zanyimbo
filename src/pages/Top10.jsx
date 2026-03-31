import { useState, useEffect } from 'react'
import { songsService } from '../lib/supabaseDatabase'
import { useMusic } from '../context/MusicContext'
import { Trophy, TrendingUp, Play, Heart, Download } from 'lucide-react'
import Header from '../components/Header'
import './Top10.css'

export default function Top10() {
  const [topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong, currentSong, isPlaying } = useMusic()

  useEffect(() => {
    fetchTopSongs()
    // Refresh top songs every 30 seconds to show real-time updates
    const interval = setInterval(fetchTopSongs, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopSongs = async () => {
    try {
      const songsData = await songsService.getAll()

      // Calculate popularity score: plays + (downloads * 5)
      const ranked = songsData.map((song, index) => ({
        ...song,
        artist: song.artistName || 'Unknown',
        popularityScore: (song.playCount || 0) + ((song.downloadCount || 0) * 5),
        rank: index + 1
      }))

      // Sort by popularity score
      ranked.sort((a, b) => b.popularityScore - a.popularityScore)
      setTopSongs(ranked.slice(0, 10))
    } catch (error) {
      console.error('Error fetching top songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (song) => {
    const queue = topSongs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      audioUrl: s.audioUrl || s.audio_url,
      coverUrl: s.coverUrl || s.cover_url,
      isDownloadable: s.isDownloadable
    }))

    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl || s.audio_url,
      coverUrl: song.coverUrl || s.cover_url,
      isDownloadable: song.isDownloadable
    }, queue)
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={24} className="rank-icon gold" />
    if (rank === 2) return <Trophy size={24} className="rank-icon silver" />
    if (rank === 3) return <Trophy size={24} className="rank-icon bronze" />
    return <span className="rank-number">{rank}</span>
  }

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1'
    if (rank === 2) return 'rank-2'
    if (rank === 3) return 'rank-3'
    return ''
  }

  if (loading) {
    return (
      <div className="top10-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Top 10...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="top10-page">
      <Header />

      <div className="top10-hero">
        <div className="top10-header">
          <TrendingUp size={48} className="top10-icon" />
          <h1>🔥 Top 10 Trending</h1>
          <p>The hottest tracks right now, ranked by plays and downloads</p>
        </div>
      </div>

      <div className="top10-container">
        <div className="top10-list">
          {topSongs.map((song) => (
            <div
              key={song.id}
              className={`top10-card ${getRankClass(song.rank)} ${currentSong?.id === song.id ? 'playing' : ''}`}
            >
              <div className="song-rank">
                {getRankIcon(song.rank)}
              </div>

              <div className="song-cover-wrapper">
                <img
                  src={song.coverUrl || 'https://via.placeholder.com/100x100/2d1f4e/ffffff?text=Music'}
                  alt={song.title}
                  className="song-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100/2d1f4e/ffffff?text=Music'
                  }}
                />
                <button
                  className="play-overlay"
                  onClick={() => handlePlay(song)}
                >
                  <Play size={32} fill="white" />
                </button>
              </div>

              <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>

                <div className="song-stats">
                  <span className="stat" title="Plays">
                    <Play size={14} /> {song.playCount || 0}
                  </span>
                  <span className="stat" title="Downloads">
                    <Download size={14} /> {song.downloadCount || 0}
                  </span>
                </div>
              </div>

              <div className="song-actions">
                <button
                  className="btn-play"
                  onClick={() => handlePlay(song)}
                >
                  {currentSong?.id === song.id && isPlaying ? 'Playing' : 'Play'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
