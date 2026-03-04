import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useMusic } from './context/MusicContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'
import Top10 from './pages/Top10'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TVPage from './pages/TVPage'
import BeatsPage from './pages/BeatsPage'
import EventsPage from './pages/EventsPage'
import PodcastsPage from './pages/PodcastsPage'
import CreatorStudio from './pages/CreatorStudio'
import GettingStarted from './pages/GettingStarted'
import HowToBuy from './pages/HowToBuy'
import PaymentMethods from './pages/PaymentMethods'
import FAQ from './pages/FAQ'
import EarlyAccess from './pages/EarlyAccess'
import Team from './pages/Team'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Legal from './pages/Legal'
import Dashboard from './pages/admin/Dashboard'
import AdminSongs from './pages/admin/Songs'
import AdminAlbums from './pages/admin/Albums'
import AdminArtists from './pages/admin/Artists'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import './App.css'

// Pages with player
const pagesWithPlayer = [
  '/', '/music', '/top-10', '/tv', '/beats', '/events', '/podcasts',
  '/getting-started', '/how-to-buy', '/payment-methods', '/faq',
  '/early-access', '/team', '/pricing', '/blog', '/contact',
  '/terms', '/privacy', '/legal'
]

function AppContent() {
  const { currentSong, isPlaying, togglePlayPause } = useMusic()
  const [currentPage, setCurrentPage] = useState('/')

  const handlePlaySong = (song, queue = null) => {
    // This will be handled by MusicContext
  }

  const showPlayer = pagesWithPlayer.includes(currentPage) && currentSong

  return (
    <div className="app">
      <Routes>
        {/* Auth Routes - No Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public Site Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home onPlaySong={handlePlaySong} />
              <Footer />
            </>
          }
        />
        <Route
          path="/music"
          element={
            <>
              <Header />
              <MusicPage onPlaySong={handlePlaySong} />
              <Footer />
            </>
          }
        />
        <Route
          path="/top-10"
          element={<Top10 />}
        />

        {/* Platform Routes */}
        <Route
          path="/tv"
          element={
            <>
              <Header />
              <TVPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/beats"
          element={
            <>
              <Header />
              <BeatsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <Header />
              <EventsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/podcasts"
          element={
            <>
              <Header />
              <PodcastsPage />
              <Footer />
            </>
          }
        />

        {/* Creator Routes */}
        <Route path="/creator-studio" element={<CreatorStudio />} />

        {/* Resource Routes */}
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/how-to-buy" element={<HowToBuy />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/early-access" element={<EarlyAccess />} />

        {/* Company Routes */}
        <Route path="/team" element={<Team />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        {/* Legal Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/songs"
          element={
            <ProtectedRoute>
              <AdminSongs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/albums"
          element={
            <ProtectedRoute>
              <AdminAlbums />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <ProtectedRoute>
              <AdminArtists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Music Player - Shows on most pages */}
      {currentSong && <MusicPlayer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
