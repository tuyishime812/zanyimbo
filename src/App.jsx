import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { useMusic } from './context/MusicContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import PWAInstall from './components/PWAInstall'
import LoadingSpinner from './components/LoadingSpinner'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'
import Top10 from './pages/Top10'
import SearchPage from './pages/SearchPage'
import SongDetail from './pages/SongDetail'
import './App.css'

// Lazy load admin pages for better performance
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminSongs = lazy(() => import('./pages/admin/Songs'))
const AdminAlbums = lazy(() => import('./pages/admin/Albums'))
const AdminArtists = lazy(() => import('./pages/admin/Artists'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

// Lazy load auth pages
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

// Lazy load other pages
const Contact = lazy(() => import('./pages/Contact'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Legal = lazy(() => import('./pages/Legal'))

// Pages with player
const pagesWithPlayer = [
  '/', '/music', '/top-10', '/contact',
  '/terms', '/privacy', '/legal', '/search'
]

function AppContent() {
  const { currentSong } = useMusic()
  const [currentPage, _] = useState('/')

  const handlePlaySong = () => {
    // This will be handled by MusicContext
  }

  const showPlayer = pagesWithPlayer.includes(currentPage) && currentSong

  return (
    <div className="app">
      <Routes>
        {/* Auth Routes - No Header/Footer */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Signup />
            </Suspense>
          }
        />

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
        <Route path="/top-10" element={<Top10 />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/song/:id"
          element={
            <>
              <Header />
              <SongDetail />
              <Footer />
            </>
          }
        />

        {/* Company Routes */}
        <Route
          path="/contact"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            </Suspense>
          }
        />

        {/* Legal Routes */}
        <Route
          path="/terms"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Terms />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Privacy />
            </Suspense>
          }
        />
        <Route
          path="/legal"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Legal />
            </Suspense>
          }
        />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/songs"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSongs />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/albums"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminAlbums />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminArtists />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminUsers />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSettings />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Music Player - Shows on most pages */}
      {currentSong && <MusicPlayer />}

      {/* PWA Install Prompt */}
      <PWAInstall />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppContent />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
