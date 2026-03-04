import { Link } from 'react-router-dom'
import { Users, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CompanyPages.css'

export default function Team() {
  const team = [
    { name: 'John Doe', role: 'CEO & Founder', image: 'https://via.placeholder.com/200x200/2d1f4e/ffffff?text=JD' },
    { name: 'Jane Smith', role: 'Head of Music', image: 'https://via.placeholder.com/200x200/4a3b6e/ffffff?text=JS' },
    { name: 'Mike Johnson', role: 'CTO', image: 'https://via.placeholder.com/200x200/2d1f4e/ffffff?text=MJ' },
    { name: 'Sarah Williams', role: 'Head of Artist Relations', image: 'https://via.placeholder.com/200x200/4a3b6e/ffffff?text=SW' },
  ]

  return (
    <div className="company-page">
      <Header />
      <main className="main-content no-player">
        <div className="company-hero">
          <div className="hero-content">
            <Users size={48} color="#ff6b35" />
            <h1>Our Team</h1>
            <p>Meet the passionate people behind Zanyimbo.</p>
          </div>
        </div>

        <div className="team-section">
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mission-section">
          <h2>Our Mission</h2>
          <p className="mission-text">
            To amplify African voices and bring authentic entertainment to the world. 
            We believe in the power of music and stories to connect people across borders 
            and cultures.
          </p>
        </div>

        <div className="join-section">
          <h2>Join Our Team</h2>
          <p>We're always looking for talented individuals who share our passion.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Get in Touch
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
