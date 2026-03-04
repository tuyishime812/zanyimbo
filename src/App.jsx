import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'
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

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlaySong = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePlayPause = (playing) => {
    setIsPlaying(playing)
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public Site Routes */}
            <Route
              path="/"
              element={
                <Home onPlaySong={handlePlaySong} />
              }
            />
            <Route
              path="/music"
              element={
                <MusicPage onPlaySong={handlePlaySong} />
              }
            />

            {/* Platform Routes */}
            <Route
              path="/tv"
              element={
                <TVPage
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
              }
            />
            <Route
              path="/beats"
              element={
                <BeatsPage
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
              }
            />
            <Route
              path="/events"
              element={
                <EventsPage
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
              }
            />
            <Route
              path="/podcasts"
              element={
                <PodcastsPage
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                />
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
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
