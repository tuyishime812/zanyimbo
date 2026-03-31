import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { songsService } from '../lib/supabaseDatabase'
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
      const songsData = await songsService.getAll()
      setBeats(songsData || [])
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
      artist: beat.artistName || 'Unknown Producer',
      audioUrl: beat.audioUrl,
      coverUrl: beat.coverUrl,
      isDownloadable: beat.isDownloadable
    })
  }

  const handleDownload = async (beat) => {
    if (!beat.isDownloadable) {
      alert('This beat is not available for purchase')
      return
    }

    const message = `Hello! I'm interested in purchasing this beat:\n\n🎵 *${beat.title}*\n🎤 Producer: ${beat.artistName || 'Unknown'}\n\nPlease send me the purchase details.`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
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
        ) : beats.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={64} />
            <h2>No Beats Available</h2>
            <p>Check back soon for fresh beats!</p>
          </div>
        ) : (
          <div className="beats-grid">
            {beats.map((beat) => (
              <div key={beat.id} className="beat-card">
                <img
                  src={beat.coverUrl || 'https://via.placeholder.com/200x200/2d1f4e/ffffff?text=Beat'}
                  alt={beat.title}
                  className="beat-cover"
                />
                <div className="beat-info">
                  <h3>{beat.title}</h3>
                  <p>{beat.artistName}</p>
                  <div className="beat-actions">
                    <button onClick={() => handlePlay(beat)} className="btn-play">
                      <Play size={18} />
                    </button>
                    <button onClick={() => handleDownload(beat)} className="btn-buy">
                      <ShoppingBag size={18} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
