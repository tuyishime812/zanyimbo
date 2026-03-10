import { Link } from 'react-router-dom'
import { Calendar, Music } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function EventsPage() {
  return (
    <div className="coming-soon-page">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge-live">
              <Calendar size={16} />
              Coming Soon
            </div>
            <h1>PAMODZI EVENTS</h1>
            <p>Live concerts, festivals, and virtual events from across Africa.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Music size={18} />
                Explore Music
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Get Event Updates
              </Link>
            </div>
          </div>
        </div>

        <div className="notify-section">
          <h2>Events Coming Soon</h2>
          <p>We're working on bringing you amazing live concerts, festivals, and virtual events. Sign up to get notified when we launch!</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
