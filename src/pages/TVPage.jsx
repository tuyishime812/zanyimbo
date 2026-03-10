import { Link } from 'react-router-dom'
import { Play, Tv } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function TVPage() {
  return (
    <div className="coming-soon-page">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge-live">
              <Tv size={16} />
              Coming Soon
            </div>
            <h1>PAMODZI TV</h1>
            <p>Premium African stories, films, and series from across the continent.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Play size={18} />
                Stream Music Now
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Create Account to Watch
              </Link>
            </div>
          </div>
        </div>

        <div className="notify-section">
          <h2>TV & Movies Coming Soon</h2>
          <p>We're working on bringing you the best African films, series, and shows. Create an account to get notified when we launch!</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
