import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react'
import './MusicPlayer.css'

export default function MusicPlayer({ currentSong, isPlaying: parentIsPlaying, onPlayPause }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off', 'all', 'one'
  
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    setIsPlaying(parentIsPlaying)
  }, [parentIsPlaying])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl || ''
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [currentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
    onPlayPause && onPlayPause(!isPlaying)
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentSong) {
    return (
      <div className="music-player empty">
        <div className="player-container">
          <p className="no-song-text">Select a song to play</p>
        </div>
      </div>
    )
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} />
      
      <div className="player-container">
        {/* Song Info */}
        <div className="player-song-info">
          <img 
            src={currentSong.coverUrl || 'https://via.placeholder.com/60x60/2d1f4e/ffffff?text=Music'} 
            alt={currentSong.title}
            className="player-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60x60/2d1f4e/ffffff?text=Music'
            }}
          />
          <div className="player-song-details">
            <span className="player-song-title">{currentSong.title}</span>
            <span className="player-song-artist">{currentSong.artist}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            <button className="control-btn" title="Previous">
              <SkipBack size={20} />
            </button>
            <button className="control-btn play-btn" onClick={togglePlayPause}>
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
            <button className="control-btn" title="Next">
              <SkipForward size={20} />
            </button>
            <button 
              className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={toggleRepeat}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={18} />
            </button>
          </div>

          <div className="progress-container" ref={progressRef} onClick={handleProgressClick}>
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
            </div>
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="player-volume">
          <button className="control-btn volume-btn" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  )
}
