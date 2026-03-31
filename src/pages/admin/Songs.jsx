import { useState, useEffect } from 'react'
import { songsService, artistsService, albumsService, genresService, songGenresService } from '../../lib/supabaseDatabase'
import { storageService } from '../../lib/storage'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, Music, X, Check } from 'lucide-react'
import './Songs.css'

export default function AdminSongs() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSong, setEditingSong] = useState(null)
  const [genres, setGenres] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    album_name: '',
    audio_url: '',
    cover_url: '',
    duration: '',
    genre_id: '',
    is_downloadable: true,
    featured: false
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchSongs()
    fetchGenres()
  }, [])

  const fetchSongs = async () => {
    try {
      const songsData = await songsService.getAll()
      setSongs(songsData || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const genresData = await genresService.getAll()
      setGenres(genresData || [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const handleOpenModal = (song = null) => {
    if (song) {
      setEditingSong(song)
      setFormData({
        title: song.title,
        artist_name: song.artistName || '',
        album_name: song.albumName || '',
        audio_url: song.audioUrl,
        cover_url: song.coverUrl || '',
        duration: song.duration || '',
        genre_id: '',
        is_downloadable: song.isDownloadable,
        featured: song.featured
      })
    } else {
      setEditingSong(null)
      setFormData({
        title: '',
        artist_name: '',
        album_name: '',
        audio_url: '',
        cover_url: '',
        duration: '',
        genre_id: '',
        is_downloadable: true,
        featured: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSong(null)
    setError('')
  }

  const handleUploadAudio = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const publicUrl = await storageService.uploadFile(file, storageService.MUSIC_BUCKET)
      setFormData({ ...formData, audio_url: publicUrl })
      toast.success('Audio uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload audio: ' + error.message)
      toast.error('Failed to upload audio')
    } finally {
      setUploading(false)
    }
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const publicUrl = await storageService.uploadFile(file, storageService.COVERS_BUCKET)
      setFormData({ ...formData, cover_url: publicUrl })
      toast.success('Cover uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload cover: ' + error.message)
      toast.error('Failed to upload cover')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!formData.title || !formData.artist_name || !formData.audio_url) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    try {
      // Find or create artist
      let artistId = null
      const allArtists = await artistsService.getAll()
      const existingArtist = allArtists.find(a => a.name === formData.artist_name)

      if (existingArtist) {
        artistId = existingArtist.id
      } else {
        // Create new artist
        artistId = await artistsService.create({
          name: formData.artist_name,
          bio: '',
          imageUrl: null,
          verified: false
        })
      }

      // Find or create album (if album name provided)
      let albumId = null
      if (formData.album_name) {
        const allAlbums = await albumsService.getAll()
        const existingAlbum = allAlbums.find(a => a.title === formData.album_name && a.artistId === artistId)

        if (existingAlbum) {
          albumId = existingAlbum.id
        } else {
          albumId = await albumsService.create({
            title: formData.album_name,
            artistId: artistId,
            coverUrl: null,
            trackCount: 0,
            featured: false,
            releaseDate: new Date().toISOString()
          })
        }
      }

      const songData = {
        title: formData.title,
        artistId: artistId,
        artistName: formData.artist_name,
        albumId: albumId || null,
        audioUrl: formData.audio_url,
        coverUrl: formData.coverUrl || null,
        duration: parseInt(formData.duration) || null,
        isDownloadable: formData.is_downloadable,
        featured: formData.featured,
        playCount: editingSong ? editingSong.playCount || 0 : 0,
        downloadCount: editingSong ? editingSong.downloadCount || 0 : 0
      }

      if (editingSong) {
        await songsService.update(editingSong.id, songData)

        // Update genre relationship
        if (formData.genre_id) {
          await songGenresService.remove(editingSong.id, formData.genre_id)
          await songGenresService.add(editingSong.id, formData.genre_id)
        }
      } else {
        const newSongId = await songsService.create(songData)

        // Add genre relationship if selected
        if (formData.genre_id) {
          await songGenresService.add(newSongId, formData.genre_id)
        }
      }

      handleCloseModal()
      fetchSongs()
      toast.success(editingSong ? 'Song updated successfully!' : 'Song added successfully!')
      setSubmitting(false)
    } catch (error) {
      console.error('Song save error:', error)
      const errorMsg = 'Failed to save song: ' + error.message
      toast.error(errorMsg)
      setError(errorMsg)
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      await songsService.delete(id)
      fetchSongs()
      toast.success('Song deleted successfully!')
    } catch (error) {
      console.error('Failed to delete song:', error)
      toast.error('Failed to delete song: ' + error.message)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AdminLayout>
      <div className="songs-page">
        <div className="page-header">
          <h2>Songs</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Song
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading songs...</div>
        ) : (
          <div className="songs-table">
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Duration</th>
                  <th>Plays</th>
                  <th>Downloads</th>
                  <th>Downloadable</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.length === 0 ? (
                  <tr>
                    <td colSpan={9}>No songs yet. Add your first song!</td>
                  </tr>
                ) : (
                  songs.map((song) => (
                    <tr key={song.id}>
                      <td>
                        <img
                          src={song.coverUrl || 'https://via.placeholder.com/50'}
                          alt=""
                          className="song-cover"
                        />
                      </td>
                      <td>
                        <div className="song-title">
                          {song.title}
                          {song.featured && <span className="featured-badge">Featured</span>}
                        </div>
                      </td>
                      <td>{song.artistName || 'Unknown'}</td>
                      <td>{song.albumName || '-'}</td>
                      <td>{formatDuration(song.duration)}</td>
                      <td>{song.playCount || 0}</td>
                      <td>{song.downloadCount || 0}</td>
                      <td>
                        {song.isDownloadable ? (
                          <Check size={18} className="text-green" />
                        ) : (
                          <X size={18} className="text-red" />
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleOpenModal(song)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(song.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
                <button className="btn-close" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="error-banner">{error}</div>
                )}

                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Artist Name *</label>
                  <input
                    type="text"
                    value={formData.artist_name}
                    onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                    placeholder="Will create if doesn't exist"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Album Name</label>
                  <input
                    type="text"
                    value={formData.album_name}
                    onChange={(e) => setFormData({ ...formData, album_name: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label>Audio File *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleUploadAudio}
                      disabled={uploading}
                    />
                    {uploading && <span>Uploading...</span>}
                    {formData.audio_url && <span>✓ Audio uploaded</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Cover Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCover}
                      disabled={uploading}
                    />
                    {uploading && <span>Uploading...</span>}
                    {formData.cover_url && (
                      <img src={formData.cover_url} alt="Cover" className="cover-preview" />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 180"
                  />
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <select
                    value={formData.genre_id}
                    onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_downloadable}
                      onChange={(e) => setFormData({ ...formData, is_downloadable: e.target.checked })}
                    />
                    Allow Download
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
                    {submitting ? 'Saving...' : editingSong ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
