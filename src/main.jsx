import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './context/ToastContext'
import { MusicProvider } from './context/MusicContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </ToastProvider>
  </StrictMode>,
)
