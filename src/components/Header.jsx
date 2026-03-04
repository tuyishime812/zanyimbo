import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, User, Music2, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Music2 className="logo-icon" />
          <div className="logo-text">
            <span className="logo-name">ZANYIMBO</span>
            <span className="logo-tagline">Now Streaming</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-item dropdown">
            <button className="nav-link">
              PLATFORM
            </button>
            <div className="dropdown-menu">
              <Link to="/music" className="dropdown-item">
                <span className="status-dot live"></span>
                Music
              </Link>
              <Link to="/top-10" className="dropdown-item">
                <span className="status-dot live"></span>
                🔥 Top 10
              </Link>
              <Link to="/tv" className="dropdown-item">
                <span className="status-dot coming-soon"></span>
                TV & Movies
              </Link>
              <Link to="/beats" className="dropdown-item">
                <span className="status-dot coming-soon"></span>
                Beats
              </Link>
              <Link to="/events" className="dropdown-item">
                <span className="status-dot coming-soon"></span>
                Events
              </Link>
              <Link to="/podcasts" className="dropdown-item">
                <span className="status-dot coming-soon"></span>
                Podcasts
              </Link>
            </div>
          </div>

          <div className="nav-item dropdown">
            <button className="nav-link">
              CREATORS
            </button>
            <div className="dropdown-menu">
              <Link to="/creator-studio" className="dropdown-item">Creator Studio</Link>
              <Link to="/getting-started" className="dropdown-item">Getting Started</Link>
              <Link to="/how-to-buy" className="dropdown-item">How to Buy Music</Link>
            </div>
          </div>

          <div className="nav-item dropdown">
            <button className="nav-link">
              RESOURCES
            </button>
            <div className="dropdown-menu">
              <Link to="/payment-methods" className="dropdown-item">Payment Methods</Link>
              <Link to="/early-access" className="dropdown-item">Early Access</Link>
              <Link to="/faq" className="dropdown-item">FAQ</Link>
              <Link to="/contact" className="dropdown-item">Contact Support</Link>
            </div>
          </div>

          <div className="nav-item dropdown">
            <button className="nav-link">
              COMPANY
            </button>
            <div className="dropdown-menu">
              <Link to="/team" className="dropdown-item">Our Team</Link>
              <Link to="/pricing" className="dropdown-item">Pricing</Link>
              <Link to="/blog" className="dropdown-item">Blog</Link>
              <Link to="/contact" className="dropdown-item">Contact Us</Link>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Search */}
          <a
            href="/search"
            className="action-btn search-btn"
            title="Advanced Search"
          >
            <Search size={20} />
          </a>

          {/* Notifications */}
          <button className="action-btn notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User Menu */}
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="action-btn user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User size={20} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <span className="user-email">{user.email}</span>
                      {isAdmin && <span className="user-role">Admin</span>}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/creator-studio" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <Music2 size={18} />
                    Creator Studio
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleSignOut}>
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="action-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <div className="mobile-nav-section">
              <h4>PLATFORM</h4>
              <Link to="/music" onClick={() => setMobileMenuOpen(false)}>Music</Link>
              <Link to="/top-10" onClick={() => setMobileMenuOpen(false)}>🔥 Top 10</Link>
              <Link to="/tv" onClick={() => setMobileMenuOpen(false)}>TV & Movies</Link>
              <Link to="/beats" onClick={() => setMobileMenuOpen(false)}>Beats</Link>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link>
              <Link to="/podcasts" onClick={() => setMobileMenuOpen(false)}>Podcasts</Link>
            </div>
            <div className="mobile-nav-section">
              <h4>CREATORS</h4>
              <Link to="/creator-studio" onClick={() => setMobileMenuOpen(false)}>Creator Studio</Link>
              <Link to="/getting-started" onClick={() => setMobileMenuOpen(false)}>Getting Started</Link>
              <Link to="/how-to-buy" onClick={() => setMobileMenuOpen(false)}>How to Buy Music</Link>
            </div>
            <div className="mobile-nav-section">
              <h4>RESOURCES</h4>
              <Link to="/payment-methods" onClick={() => setMobileMenuOpen(false)}>Payment Methods</Link>
              <Link to="/early-access" onClick={() => setMobileMenuOpen(false)}>Early Access</Link>
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Support</Link>
            </div>
            <div className="mobile-nav-section">
              <h4>COMPANY</h4>
              <Link to="/team" onClick={() => setMobileMenuOpen(false)}>Our Team</Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </div>
            {!user && (
              <div className="mobile-nav-section mobile-auth">
                <Link to="/login" className="btn btn-sm btn-primary btn-block">Sign In</Link>
                <Link to="/signup" className="btn btn-sm btn-secondary btn-block">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
