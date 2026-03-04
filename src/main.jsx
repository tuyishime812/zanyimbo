import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './context/ToastContext'
import { MusicProvider } from './context/MusicContext'
import { registerServiceWorker } from './hooks/useServiceWorker'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </ToastProvider>
  </StrictMode>,
)
