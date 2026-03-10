import { Link } from 'react-router-dom'
import { Calendar, MapPin, Music, Users } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ComingSoonPage.css'

export default function EventsPage() {
  const upcomingEvents = [
    { id: 1, name: 'Afrobeats Festival 2026', date: 'Jun 15, 2026', location: 'Lagos, Nigeria' },
    { id: 2, name: 'Amapiano Night', date: 'Apr 20, 2026', location: 'Johannesburg, SA' },
    { id: 3, name: 'Pamodzi Live Concert', date: 'Aug 8, 2026', location: 'Lilongwe, Malawi' },
    { id: 4, name: 'Virtual Jazz Session', date: 'Mar 30, 2026', location: 'Online' },
  ]

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

        <div className="events-preview">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-date">
                  <Calendar size={24} color="#ff6b35" />
                  <span>{event.date}</span>
                </div>
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <div className="event-location">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="event-action">
                  <span className="status-tag">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section">
          <div className="feature-box">
            <Users size={32} color="#ff6b35" />
            <h3>Virtual Events</h3>
            <p>Join live streams from your favorite artists.</p>
          </div>
          <div className="feature-box">
            <MapPin size={32} color="#4a3b6e" />
            <h3>Local Concerts</h3>
            <p>Discover events happening near you.</p>
          </div>
          <div className="feature-box">
            <Calendar size={32} color="#22c55e" />
            <h3>Festival Tickets</h3>
            <p>Get early access to major music festivals.</p>
          </div>
        </div>

        <div className="notify-section">
          <h2>Never Miss an Event</h2>
          <p>Sign up to get notifications about upcoming concerts and festivals.</p>
          <Link to="/signup" className="btn btn-primary">
            Get Notified
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
