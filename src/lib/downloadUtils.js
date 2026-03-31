import ID3Writer from 'browser-id3-writer'

/**
 * Check if the device is iOS
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

/**
 * Check if the device is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Sanitize filename - remove special characters
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9\s\-\.]/gi, '_') // Replace special chars with underscore
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

/**
 * Download a song with embedded metadata (ID3 tags)
 * @param {Object} song - Song object with title, artist, cover art, etc.
 * @param {string} filename - Desired filename for the download
 */
export async function downloadSongWithMetadata(song, filename = null) {
  const audioUrl = song.audio_url || song.audioUrl

  if (!audioUrl) {
    throw new Error('No audio URL provided')
  }

  const isIOSDevice = isIOS()

  try {
    // For iOS devices, use direct download (iOS doesn't support blob downloads well)
    if (isIOSDevice) {
      // iOS: download directly (will open but user can save)
      window.location.href = audioUrl
      return true
    }

    // Fetch the audio file as array buffer
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch audio file')
    }
    const arrayBuffer = await response.arrayBuffer()

    // Fetch cover art if available
    let coverArt = null
    if (song.cover_url || song.coverUrl) {
      try {
        const coverResponse = await fetch(song.cover_url || song.coverUrl)
        if (coverResponse.ok) {
          coverArt = await coverResponse.arrayBuffer()
        }
      } catch (e) {
        console.warn('Failed to fetch cover art:', e)
      }
    }

    // Create ID3 writer
    const writer = new ID3Writer(arrayBuffer)

    // Set metadata
    writer.setFrame('TIT2', song.title) // Title
    writer.setFrame('TPE1', song.artistName || song.artist) // Artist
    writer.setFrame('TALB', song.albumName || song.album || 'Unknown Album') // Album

    // Add cover art if available
    if (coverArt) {
      writer.setFrame('APIC', {
        type: 3, // Front cover
        data: coverArt,
        description: 'Cover art'
      })
    }

    // Save the modified file
    const taggedBuffer = writer.save()
    const blob = new Blob([taggedBuffer], { type: 'audio/mpeg' })

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Use provided filename or generate one from song data
    const defaultFilename = sanitizeFilename(`${song.artistName || song.artist} - ${song.title}.mp3`)
    link.download = filename || defaultFilename

    // Force download (prevent opening in new tab)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error('Error adding metadata to song:', error)
    // Fallback: download without metadata
    await simpleDownload(audioUrl, filename || sanitizeFilename(`${song.artistName || song.artist} - ${song.title}.mp3`))
    return true
  }
}

/**
 * Simple download without metadata (fallback)
 * Downloads in SAME tab - no new tab opening
 */
export async function simpleDownload(audioUrl, filename) {
  const isIOSDevice = isIOS()

  try {
    // Try to fetch as blob first (works for most browsers)
    const response = await fetch(audioUrl)
    if (!response.ok) throw new Error('Download failed')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 100)
    
  } catch (error) {
    console.warn('Blob download failed, trying direct download:', error)
    // Final fallback: direct download (same tab)
    window.location.href = audioUrl
  }
}

/**
 * Mobile-friendly download - works on all devices
 * Downloads in SAME tab - no new tab opening
 */
export function mobileDownload(audioUrl, filename) {
  const isIOSDevice = isIOS()

  if (isIOSDevice) {
    // iOS: download directly in same tab
    window.location.href = audioUrl
  } else {
    // Android and other: use blob download
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
