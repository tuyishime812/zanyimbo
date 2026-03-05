import { Link } from 'react-router-dom'
import { Headphones, Play, ShoppingBag } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function BeatsPage() {
  const beatCategories = ['Afrobeats', 'Amapiano', 'Hip Hop', 'R&B', 'Gospel', 'Traditional']

  return (
    <div className="coming-soon-page">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <div className="badge-live">
              <Headphones size={16} />
              Coming Soon
            </div>
            <h1>BEATS MARKETPLACE</h1>
            <p>Buy and sell production-ready beats from Africa's top producers.</p>
            <div className="cta-buttons">
              <Link to="/music" className="btn btn-primary">
                <Play size={18} />
                Stream Music Now
              </Link>
              <Link to="/creator-studio" className="btn btn-secondary">
                Join as Producer
              </Link>
            </div>
          </div>
        </div>

        <div className="features-preview">
          <h2>What's Coming</h2>
          <div className="features-grid">
            <div className="feature-preview-card">
              <ShoppingBag size={40} color="#ff6b35" />
              <h3>Buy Beats</h3>
              <p>Browse thousands of beats with instant download licenses.</p>
            </div>
            <div className="feature-preview-card">
              <Headphones size={40} color="#4a3b6e" />
              <h3>Sell Your Beats</h3>
              <p>Upload your productions and earn from your creativity.</p>
            </div>
            <div className="feature-preview-card">
              <Play size={40} color="#22c55e" />
              <h3>Preview Before Buy</h3>
              <p>Listen to full previews with watermark protection.</p>
            </div>
          </div>
        </div>

        <div className="categories-preview">
          <h2>Beat Categories</h2>
          <div className="category-tags">
            {beatCategories.map((cat) => (
              <span key={cat} className="category-tag">{cat}</span>
            ))}
          </div>
        </div>

        <div className="notify-section">
          <h2>Start Selling Your Beats</h2>
          <p>Join our producer community and monetize your productions.</p>
          <Link to="/creator-studio" className="btn btn-primary">
            Become a Producer
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
