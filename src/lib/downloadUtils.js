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
  const isMobileDevice = isMobile()

  try {
    // For iOS devices, use direct download approach
    if (isIOSDevice) {
      // iOS has strict restrictions on downloads
      // Open in new tab or use window.location for download
      window.open(audioUrl, '_blank')
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
    writer.setFrame('TPE1', song.artist) // Artist
    writer.setFrame('TALB', song.album || 'Unknown Album') // Album

    // Add cover art if available
    if (coverArt) {
      writer.setFrame('APIC', {
        type: 3, // Front cover
        data: coverArt,
        description: 'Cover art'
      })
    }

    // Add year if available
    if (song.year) {
      writer.setFrame('TYER', song.year.toString())
    }

    // Add genre if available
    if (song.genre) {
      writer.setFrame('TCON', song.genre)
    }

    // Save the modified file
    const taggedBuffer = writer.save()
    const blob = new Blob([taggedBuffer], { type: 'audio/mpeg' })

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Use provided filename or generate one
    const defaultFilename = `${song.artist} - ${song.title}.mp3`
      .replace(/[^a-z0-9\s\-\.]/gi, '_') // Replace special chars
      .replace(/\s+/g, ' ') // Normalize spaces
    link.download = filename || defaultFilename

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
    throw error
  }
}

/**
 * Simple download without metadata (fallback)
 */
export async function simpleDownload(audioUrl, filename) {
  const isIOSDevice = isIOS()
  
  // For iOS, open directly in new tab
  if (isIOSDevice) {
    window.open(audioUrl, '_blank')
    return
  }

  try {
    const response = await fetch(audioUrl)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    // Final fallback: open in new tab
    window.open(audioUrl, '_blank')
  }
}

/**
 * Mobile-friendly download that works on iOS
 */
export function mobileDownload(audioUrl, filename) {
  const isIOSDevice = isIOS()
  
  if (isIOSDevice) {
    // iOS: open in new tab
    window.open(audioUrl, '_blank')
  } else {
    // Android and other mobile: try blob download
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
