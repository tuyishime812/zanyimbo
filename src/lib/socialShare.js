/**
 * Social Sharing Utilities
 * Share songs, albums, and artists to various platforms
 */

const baseUrl = 'https://dgt-sounds.com'

/**
 * Share to WhatsApp
 * @param {string} url - URL to share
 * @param {string} title - Title/content
 */
export function shareToWhatsApp(url, title) {
  const encodedUrl = encodeURIComponent(`${baseUrl}${url}`)
  const encodedText = encodeURIComponent(`Check out "${title}" on DGT Sounds! 🎵`)
  window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank')
}

/**
 * Share to Twitter/X
 * @param {string} url - URL to share
 * @param {string} title - Title/content
 * @param {string} handle - Twitter handle to mention
 */
export function shareToTwitter(url, title, handle = '@dgtsounds') {
  const encodedUrl = encodeURIComponent(`${baseUrl}${url}`)
  const encodedText = encodeURIComponent(`Check out "${title}" on DGT Sounds! 🎵 ${handle}`)
  window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')
}

/**
 * Share to Facebook
 * @param {string} url - URL to share
 */
export function shareToFacebook(url) {
  const encodedUrl = encodeURIComponent(`${baseUrl}${url}`)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
}

/**
 * Share to LinkedIn
 * @param {string} url - URL to share
 * @param {string} title - Title
 */
export function shareToLinkedIn(url, title) {
  const encodedUrl = encodeURIComponent(`${baseUrl}${url}`)
  const encodedTitle = encodeURIComponent(title)
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, '_blank')
}

/**
 * Share via native Web Share API (mobile)
 * @param {Object} options - Share options
 */
export async function shareNative({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || 'DGT Sounds',
        text: text || 'Check this out on DGT Sounds!',
        url: `${baseUrl}${url}`
      })
      return true
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Native share failed:', err)
      }
      return false
    }
  }
  return false
}

/**
 * Copy link to clipboard
 * @param {string} url - URL to copy
 */
export async function copyToClipboard(url) {
  const fullUrl = `${baseUrl}${url}`
  try {
    await navigator.clipboard.writeText(fullUrl)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = fullUrl
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      document.body.removeChild(textArea)
      console.error('Copy failed:', fallbackErr)
      return false
    }
  }
}

/**
 * Share song
 * @param {Object} song - Song object
 */
export function shareSong(song) {
  const url = `/song/${song.id}`
  const title = `${song.title} - ${song.artist_name || 'Unknown Artist'}`
  
  return {
    whatsapp: () => shareToWhatsApp(url, title),
    twitter: () => shareToTwitter(url, title),
    facebook: () => shareToFacebook(url),
    linkedin: () => shareToLinkedIn(url, title),
    native: () => shareNative({ title, text: `Listen to "${song.title}"`, url }),
    copy: () => copyToClipboard(url)
  }
}

/**
 * Share album
 * @param {Object} album - Album object
 */
export function shareAlbum(album) {
  const url = `/music?album=${album.id}`
  const title = `${album.title} - Album`
  
  return {
    whatsapp: () => shareToWhatsApp(url, title),
    twitter: () => shareToTwitter(url, title),
    facebook: () => shareToFacebook(url),
    linkedin: () => shareToLinkedIn(url, title),
    native: () => shareNative({ title, text: `Check out this album: "${album.title}"`, url }),
    copy: () => copyToClipboard(url)
  }
}

/**
 * Share artist
 * @param {Object} artist - Artist object
 */
export function shareArtist(artist) {
  const url = `/music?artist=${artist.id}`
  const title = `${artist.name} - Artist`
  
  return {
    whatsapp: () => shareToWhatsApp(url, title),
    twitter: () => shareToTwitter(url, title),
    facebook: () => shareToFacebook(url),
    linkedin: () => shareToLinkedIn(url, title),
    native: () => shareNative({ title, text: `Check out this artist: "${artist.name}"`, url }),
    copy: () => copyToClipboard(url)
  }
}

/**
 * Get share count (placeholder - implement with your analytics)
 * @param {string} url - URL to get share count for
 */
export async function getShareCount(url) {
  // This would typically call your backend or a social media API
  // For now, return a mock count
  return Math.floor(Math.random() * 1000)
}

export default {
  shareToWhatsApp,
  shareToTwitter,
  shareToFacebook,
  shareToLinkedIn,
  shareNative,
  copyToClipboard,
  shareSong,
  shareAlbum,
  shareArtist
}
