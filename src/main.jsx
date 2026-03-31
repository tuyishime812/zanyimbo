import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './context/ToastContext'
import { MusicProvider } from './context/MusicContext'
import { registerServiceWorker } from './hooks/useServiceWorker'
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
registerServiceWorker()

// Initialize Google Analytics
function AnalyticsWrapper({ children }) {
  useGoogleAnalytics()
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AnalyticsWrapper>
        <ToastProvider>
          <MusicProvider>
            <App />
          </MusicProvider>
        </ToastProvider>
      </AnalyticsWrapper>
    </ErrorBoundary>
  </StrictMode>,
)
