import { useEffect } from 'react'

/**
 * Google Analytics 4 Integration
 * Tracks page views and custom events
 */
export function useGoogleAnalytics() {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID

  useEffect(() => {
    if (!trackingId) {
      console.warn('Google Analytics tracking ID not configured')
      return
    }

    // Load GA script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', trackingId, {
      send_page_view: true
    })

    // Track page views on route changes
    const trackPageView = () => {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      })
    }

    // Initial page view
    trackPageView()

    // Listen for popstate (browser back/forward)
    const handlePopState = () => {
      setTimeout(trackPageView, 100)
    }
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [trackingId])
}

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {Object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/**
 * Track song play
 * @param {string} songId - Song ID
 * @param {string} songTitle - Song title
 * @param {string} artist - Artist name
 */
export function trackSongPlay(songId, songTitle, artist) {
  trackEvent('song_play', {
    event_category: 'music',
    event_label: songTitle,
    song_id: songId,
    song_title: songTitle,
    artist: artist
  })
}

/**
 * Track song download
 * @param {string} songId - Song ID
 * @param {string} songTitle - Song title
 * @param {string} artist - Artist name
 */
export function trackDownload(songId, songTitle, artist) {
  trackEvent('download', {
    event_category: 'music',
    event_label: songTitle,
    song_id: songId,
    song_title: songTitle,
    artist: artist
  })
}

/**
 * Track search
 * @param {string} searchTerm - Search term
 */
export function trackSearch(searchTerm) {
  trackEvent('search', {
    event_category: 'navigation',
    event_label: searchTerm,
    search_term: searchTerm
  })
}

/**
 * Track user signup
 * @param {string} method - Signup method (email, google, etc.)
 */
export function trackSignup(method = 'email') {
  trackEvent('sign_up', {
    event_category: 'authentication',
    method: method
  })
}

/**
 * Track login
 * @param {string} method - Login method
 */
export function trackLogin(method = 'email') {
  trackEvent('login', {
    event_category: 'authentication',
    method: method
  })
}

export default useGoogleAnalytics
