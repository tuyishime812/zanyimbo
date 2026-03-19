import { Link } from 'react-router-dom'
import { Mic, Play } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function PodcastsPage() {
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
            <h1>DGT SOUNDS PODCASTS</h1>
            <p>Voices from across the continent. Stories that matter.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Play size={18} />
                Stream Music Now
              </Link>
            </div>
          </div>
        </div>

        <div className="notify-section">
          <h2>Podcasts Coming Soon</h2>
          <p>We're working on bringing you the best African podcasts. Stay tuned!</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
