import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Headphones, Play, ShoppingBag, Download } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function BeatsPage() {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong } = useMusic()

  useEffect(() => {
    fetchBeats()
  }, [])

  const fetchBeats = async () => {
    try {
      const { data, error } = await supabase
        .from('beats')
        .select(`
          *,
          artists (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBeats(data || [])
    } catch (error) {
      console.error('Error fetching beats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (beat) => {
    playSong({
      id: beat.id,
      title: beat.title,
      artist: beat.artists?.name || 'Unknown Producer',
      audio_url: beat.audio_url,
      cover_url: beat.cover_url,
      is_downloadable: beat.is_downloadable,
      price: beat.price
    })
  }

  const handleDownload = async (beat) => {
    if (!beat.is_downloadable) {
      alert('This beat is not available for purchase')
      return
    }

    try {
      // Track download/purchase intent
      await supabase.from('beat_downloads').insert({
        beat_id: beat.id
      })

      // Trigger download
      const link = document.createElement('a')
      link.href = beat.audio_url
      link.download = `${beat.title} - ${beat.artists?.name}.mp3`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download beat')
    }
  }

  return (
    <div className="coming-soon-page">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge-live">
              <Headphones size={16} />
              Beats Marketplace
            </div>
            <h1>BEATS MARKETPLACE</h1>
            <p>Buy production-ready beats from Africa's top producers.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Play size={18} />
                Stream Music
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Become a Producer
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading beats...</p>
          </div>
        ) : beats.length > 0 ? (
          <div className="beats-section">
            <h2>Available Beats</h2>
            <div className="beats-grid">
              {beats.map((beat) => (
                <div key={beat.id} className="beat-card">
                  <div className="beat-cover">
                    <img
                      src={beat.cover_url || 'https://via.placeholder.com/200x200/2d1f4e/ffffff?text=Beat'}
                      alt={beat.title}
                    />
                    <button
                      className="play-overlay"
                      onClick={() => handlePlay(beat)}
                    >
                      <Play size={32} fill="white" />
                    </button>
                  </div>
                  <div className="beat-info">
                    <h3>{beat.title}</h3>
                    <p className="producer">{beat.artists?.name || 'Unknown Producer'}</p>
                    <div className="beat-meta">
                      <span>{beat.bpm || '--'} BPM</span>
                      <span>{beat.key || '--'}</span>
                    </div>
                    <div className="beat-price">
                      <span className="price">${beat.price || '0.00'}</span>
                    </div>
                    <div className="beat-actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handlePlay(beat)}
                      >
                        <Play size={16} /> Preview
                      </button>
                      {beat.is_downloadable && (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDownload(beat)}
                        >
                          <Download size={16} /> Purchase
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-beats">
            <h2>No Beats Available Yet</h2>
            <p>Check back soon for new beats from our producers!</p>
          </div>
        )}

        <div className="producer-cta">
          <h2>Are You a Producer?</h2>
          <p>Join Zanyimbo to sell your beats and earn revenue from your productions.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Register as Producer
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
