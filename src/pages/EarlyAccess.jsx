import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ResourcePages.css'

export default function EarlyAccess() {
  return (
    <div className="resource-page">
      <Header />
      <main className="main-content no-player">
        <div className="resource-hero">
          <div className="hero-content">
            <Clock size={48} color="#ff6b35" />
            <h1>Early Access Program</h1>
            <p>Be the first to experience new features and content.</p>
          </div>
        </div>

        <div className="early-access-content">
          <div className="info-card large">
            <h2>What is Early Access?</h2>
            <p>Our Early Access program gives you exclusive first looks at new features, content, and platforms before they're available to everyone.</p>
          </div>

          <div className="benefits-section">
            <h2>Benefits of Early Access</h2>
            <ul className="benefits-list">
              <li>
                <strong>First Access:</strong> Try new features before anyone else
              </li>
              <li>
                <strong>Direct Input:</strong> Your feedback shapes the final product
              </li>
              <li>
                <strong>Exclusive Content:</strong> Access to beta features and content
              </li>
              <li>
                <strong>Special Perks:</strong> Early access members get special badges and rewards
              </li>
            </ul>
          </div>

          <div className="upcoming-section">
            <h2>Coming Soon to Early Access</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>DGT Sounds TV</h3>
                <p>Stream premium African films, series, and shows.</p>
                <span className="status-tag">Q2 2026</span>
              </div>
              <div className="feature-card">
                <h3>Beats Marketplace</h3>
                <p>Buy and sell production-ready beats.</p>
                <span className="status-tag">Q3 2026</span>
              </div>
              <div className="feature-card">
                <h3>Live Events</h3>
                <p>Virtual concerts and live streams.</p>
                <span className="status-tag">Q2 2026</span>
              </div>
              <div className="feature-card">
                <h3>Podcasts</h3>
                <p>African voices and stories.</p>
                <span className="status-tag">Q2 2026</span>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Join Early Access</h2>
            <p>Sign up now to get notified when new features launch.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Sign Up Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
