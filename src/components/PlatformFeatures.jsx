import { Music, Tv, Headphones, Calendar, Mic } from 'lucide-react'
import './PlatformFeatures.css'

const features = [
  {
    id: 'music',
    title: 'ZANYIMBO MUSIC',
    description: "Stream Africa's hottest tracks",
    icon: Music,
    status: 'live',
    link: '/music'
  },
  {
    id: 'tv',
    title: 'ZANYIMBO TV',
    description: 'Premium African stories, films, series',
    icon: Tv,
    status: 'coming_soon',
    link: '/tv'
  },
  {
    id: 'beats',
    title: 'BEATS MARKETPLACE',
    description: 'Buy/sell production-ready beats',
    icon: Headphones,
    status: 'coming_soon',
    link: '/beats'
  },
  {
    id: 'events',
    title: 'ZANYIMBO EVENTS',
    description: 'Live concerts, festivals, virtual events',
    icon: Calendar,
    status: 'coming_soon',
    link: '/events'
  },
  {
    id: 'podcasts',
    title: 'PODCASTS',
    description: 'Voices from across the continent',
    icon: Mic,
    status: 'coming_soon',
    link: '/podcasts'
  }
]

export default function PlatformFeatures() {
  return (
    <section className="platform-features">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">ONE PLATFORM. EVERY EXPERIENCE.</h2>
        </div>
        
        <div className="features-grid">
          {features.map((feature) => (
            <a 
              key={feature.id} 
              href={feature.link}
              className={`feature-card ${feature.status}`}
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <div className="feature-status">
                <span className={`badge badge-${feature.status}`}>
                  {feature.status === 'live' ? 'Live' : 'Coming Soon'}
                </span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
