import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { statsService, songsService, albumsService, artistsService } from '../../lib/supabaseDatabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { 
  Music, Disc, Mic2, Play, Download, Users, Plus, 
  ArrowUpRight, Clock, Star, Activity, Zap, Headphones
} from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    songs: 0,
    albums: 0,
    artists: 0,
    totalPlays: 0,
    totalDownloads: 0
  })
  const [recentSongs, setRecentSongs] = useState([])
  const [featuredSongs, setFeaturedSongs] = useState([])
  const [topArtists, setTopArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, allSongs, allAlbums, allArtists] = await Promise.all([
        statsService.getDashboardStats(),
        songsService.getAll(),
        albumsService.getAll(),
        artistsService.getAll()
      ])

      setStats(statsData)
      setRecentSongs(allSongs.slice(0, 5))
      setFeaturedSongs(allSongs.filter(s => s.featured).slice(0, 3))
      
      const artistsWithSongCount = allArtists.map(artist => ({
        ...artist,
        songCount: allSongs.filter(s => s.artistName === artist.name).length
      }))
      setTopArtists(
        artistsWithSongCount
          .sort((a, b) => {
            if (a.verified && !b.verified) return -1
            if (!a.verified && b.verified) return 1
            return b.songCount - a.songCount
          })
          .slice(0, 5)
      )
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Songs', 
      value: stats.songs || 0, 
      icon: Music, 
      color: '#ff6b35',
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #ff8c61 100%)'
    },
    { 
      title: 'Total Albums', 
      value: stats.albums || 0, 
      icon: Disc, 
      color: '#4a3b6e',
      gradient: 'linear-gradient(135deg, #4a3b6e 0%, #6b5b8e 100%)'
    },
    { 
      title: 'Total Artists', 
      value: stats.artists || 0, 
      icon: Mic2, 
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)'
    },
    { 
      title: 'Total Plays', 
      value: (stats.totalPlays || 0).toLocaleString(), 
      icon: Play, 
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    },
    { 
      title: 'Total Downloads', 
      value: (stats.totalDownloads || 0).toLocaleString(), 
      icon: Download, 
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    }
  ]

  const quickActions = [
    { label: 'Add Song', icon: Plus, href: '/admin/songs', color: '#ff6b35' },
    { label: 'Add Album', icon: Disc, href: '/admin/albums', color: '#4a3b6e' },
    { label: 'Add Artist', icon: Mic2, href: '/admin/artists', color: '#22c55e' },
    { label: 'Manage Users', icon: Users, href: '/admin/users', color: '#3b82f6' }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening with your music today.</p>
          </div>
          <Link to="/admin/songs" className="btn btn-primary">
            <Plus size={18} />
            Add New Song
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <Activity size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-bg" style={{ background: stat.gradient, opacity: 0.1 }}></div>
              <div className="stat-header">
                <div className="stat-icon" style={{ background: stat.gradient }}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href} className="quick-action-card">
                <div className="quick-action-icon" style={{ background: `${action.color}20`, color: action.color }}>
                  <action.icon size={28} />
                </div>
                <span className="quick-action-label">{action.label}</span>
                <Plus size={16} className="quick-action-plus" />
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Songs */}
          <div className="dashboard-card recent-songs-card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={20} />
                <h2>Recently Added</h2>
              </div>
              <Link to="/admin/songs" className="card-link">View All</Link>
            </div>
            {recentSongs.length === 0 ? (
              <div className="empty-state">
                <Music size={48} />
                <p>No songs yet</p>
                <Link to="/admin/songs" className="btn btn-sm">Add Your First Song</Link>
              </div>
            ) : (
              <div className="songs-list">
                {recentSongs.map((song, index) => (
                  <div key={song.id} className="song-item">
                    <span className="song-rank">{index + 1}</span>
                    <img
                      src={song.coverUrl || 'https://via.placeholder.com/50'}
                      alt={song.title}
                      className="song-cover"
                    />
                    <div className="song-details">
                      <h4>{song.title}</h4>
                      <p>{song.artistName || 'Unknown Artist'}</p>
                    </div>
                    <div className="song-stats">
                      <span className="song-stat">
                        <Play size={14} />
                        {song.playCount || 0}
                      </span>
                      <span className="song-stat">
                        <Download size={14} />
                        {song.downloadCount || 0}
                      </span>
                    </div>
                    {song.featured && (
                      <span className="featured-badge">
                        <Star size={12} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Artists */}
          <div className="dashboard-card top-artists-card">
            <div className="card-header">
              <div className="card-title">
                <Mic2 size={20} />
                <h2>Top Artists</h2>
              </div>
              <Link to="/admin/artists" className="card-link">View All</Link>
            </div>
            {topArtists.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>No artists yet</p>
                <Link to="/admin/artists" className="btn btn-sm">Add Your First Artist</Link>
              </div>
            ) : (
              <div className="artists-list">
                {topArtists.map((artist, index) => (
                  <div key={artist.id} className="artist-item">
                    <span className="artist-rank">{index + 1}</span>
                    <img
                      src={artist.imageUrl || 'https://via.placeholder.com/50'}
                      alt={artist.name}
                      className="artist-avatar"
                    />
                    <div className="artist-details">
                      <h4>{artist.name}</h4>
                      <div className="artist-meta">
                        {artist.verified && (
                          <span className="verified-badge">
                            <Zap size={12} /> Verified
                          </span>
                        )}
                        <span className="song-count">{artist.songCount} songs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured & Activity */}
        <div className="dashboard-grid">
          {/* Featured Songs */}
          <div className="dashboard-card featured-card">
            <div className="card-header">
              <div className="card-title">
                <Star size={20} />
                <h2>Featured Content</h2>
              </div>
              <Link to="/admin/songs" className="card-link">Manage</Link>
            </div>
            {featuredSongs.length === 0 ? (
              <div className="empty-state">
                <Star size={48} />
                <p>No featured songs</p>
                <p className="empty-hint">Mark songs as featured to highlight them</p>
              </div>
            ) : (
              <div className="featured-grid">
                {featuredSongs.map((song) => (
                  <div key={song.id} className="featured-item">
                    <img
                      src={song.coverUrl || 'https://via.placeholder.com/100'}
                      alt={song.title}
                      className="featured-cover"
                    />
                    <div className="featured-info">
                      <h4>{song.title}</h4>
                      <p>{song.artistName}</p>
                      <div className="featured-stats">
                        <span><Play size={12} /> {song.playCount || 0}</span>
                        <span><Download size={12} /> {song.downloadCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Activity */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={20} />
                <h2>Platform Activity</h2>
              </div>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon" style={{ background: '#ff6b3520', color: '#ff6b35' }}>
                  <Music size={18} />
                </div>
                <div className="activity-info">
                  <h4>Total Tracks</h4>
                  <p>{stats.songs || 0} songs in library</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon" style={{ background: '#4a3b6e20', color: '#4a3b6e' }}>
                  <Disc size={18} />
                </div>
                <div className="activity-info">
                  <h4>Total Albums</h4>
                  <p>{stats.albums || 0} albums available</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon" style={{ background: '#22c55e20', color: '#22c55e' }}>
                  <Users size={18} />
                </div>
                <div className="activity-info">
                  <h4>Total Artists</h4>
                  <p>{stats.artists || 0} artists signed up</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}>
                  <Headphones size={18} />
                </div>
                <div className="activity-info">
                  <h4>Total Streams</h4>
                  <p>{(stats.totalPlays || 0).toLocaleString()} all-time plays</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
