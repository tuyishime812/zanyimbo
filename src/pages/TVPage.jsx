import { Link } from 'react-router-dom'
import { Play, Tv, Star, TrendingUp } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function TVPage() {
  const featuredShows = [
    { id: 1, title: 'Nollywood Classics', category: 'Drama', rating: 4.8 },
    { id: 2, title: 'Afro Beats TV', category: 'Music', rating: 4.9 },
    { id: 3, title: 'Sahara Stories', category: 'Documentary', rating: 4.7 },
    { id: 4, title: 'Lagos Life', category: 'Series', rating: 4.6 },
  ]

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
                Get Early Access
              </Link>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h2>Coming Soon</h2>
          <div className="shows-grid">
            {featuredShows.map((show) => (
              <div key={show.id} className="show-card">
                <div className="show-poster">
                  <img src={`https://via.placeholder.com/300x450/2d1f4e/ffffff?text=${encodeURIComponent(show.title)}`} alt={show.title} />
                  <div className="show-overlay">
                    <Star size={20} fill="#ff6b35" color="#ff6b35" />
                    <span>{show.rating}</span>
                  </div>
                </div>
                <div className="show-info">
                  <h3>{show.title}</h3>
                  <p>{show.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notify-section">
          <h2>Be the First to Know</h2>
          <p>Sign up to get notified when PAMODZI TV launches in your region.</p>
          <Link to="/signup" className="btn btn-primary">
            Notify Me
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
