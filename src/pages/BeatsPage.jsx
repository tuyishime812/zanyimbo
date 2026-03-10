import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Headphones, Play, ShoppingBag, Download, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function BeatsPage() {
  const [beats, setBeats] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong } = useMusic()

  // Your phone number for WhatsApp (with country code, no + sign)
  const phoneNumber = '265990342825' // Malawi country code +265

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

    // Send WhatsApp message to purchase
    const message = `Hello! I'm interested in purchasing this beat:\n\n🎵 *${beat.title}*\n🎤 Producer: ${beat.artists?.name || 'Unknown'}\n💰 Price: $${beat.price || 'N/A'}\n\nPlease send me the purchase details. Thank you!`
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    // Track interest
    try {
      await supabase.from('beat_downloads').insert({
        beat_id: beat.id
      })
    } catch (error) {
      console.error('Error tracking beat interest:', error)
    }
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
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
                          <MessageCircle size={16} /> Buy on WhatsApp
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
          <p>Join Pamodzi to sell your beats and earn revenue from your productions.</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => {
              const message = 'Hello! I want to register as a producer on Pamodzi to sell my beats. Please send me the registration details.'
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, '_blank')
            }}
          >
            <MessageCircle size={24} /> Register as Producer
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
