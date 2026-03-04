import { Link } from 'react-router-dom'
import { Mic, Play, Headphones, Radio } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MusicPlayer from '../components/MusicPlayer'
import './ComingSoonPage.css'

export default function PodcastsPage({ onPlaySong, currentSong, isPlaying, onPlayPause }) {
  const podcastCategories = ['Music', 'Culture', 'Business', 'Technology', 'Lifestyle', 'News']

  const featuredPodcasts = [
    { id: 1, title: 'Afro Voices', host: 'Various Hosts', episodes: 45 },
    { id: 2, title: 'Tech in Africa', host: 'Tech Hub', episodes: 32 },
    { id: 3, title: 'Business Talk', host: 'Entrepreneurs Network', episodes: 28 },
    { id: 4, title: 'Culture Unplugged', host: 'Cultural Foundation', episodes: 56 },
  ]

  return (
    <div className="coming-soon-page">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge-live">
              <Mic size={16} />
              Coming Soon
            </div>
            <h1>PODCASTS</h1>
            <p>Voices from across the continent. Stories that matter.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Play size={18} />
                Stream Music Now
              </Link>
              <Link to="/creator-studio" className="btn btn-secondary">
                Start Your Podcast
              </Link>
            </div>
          </div>
        </div>

        <div className="podcasts-preview">
          <h2>Featured Podcasts</h2>
          <div className="podcast-grid">
            {featuredPodcasts.map((podcast) => (
              <div key={podcast.id} className="podcast-card">
                <div className="podcast-art">
                  <img src={`https://via.placeholder.com/200x200/2d1f4e/ffffff?text=${encodeURIComponent(podcast.title)}`} alt={podcast.title} />
                  <div className="podcast-play">
                    <Play size={24} fill="white" />
                  </div>
                </div>
                <div className="podcast-info">
                  <h3>{podcast.title}</h3>
                  <p>{podcast.host}</p>
                  <span className="episode-count">{podcast.episodes} episodes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="categories-section">
          <h2>Browse Categories</h2>
          <div className="category-tags">
            {podcastCategories.map((cat) => (
              <span key={cat} className="category-tag">{cat}</span>
            ))}
          </div>
        </div>

        <div className="creator-section">
          <div className="creator-content">
            <Radio size={48} color="#ff6b35" />
            <h2>Start Your Own Podcast</h2>
            <p>Share your voice with Africa. Easy setup, global reach.</p>
            <Link to="/creator-studio" className="btn btn-primary">
              <Headphones size={18} />
              Get Started
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
      />
    </div>
  )
}
