import { useState, useEffect } from 'react'
import { artistsService } from '../../lib/supabaseDatabase'
import { storageService } from '../../lib/storage'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, X, Check } from 'lucide-react'
import './Artists.css'

export default function AdminArtists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingArtist, setEditingArtist] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image_url: '',
    verified: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const artistsData = await artistsService.getAll()
      setArtists(artistsData || [])
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (artist = null) => {
    if (artist) {
      setEditingArtist(artist)
      setFormData({
        name: artist.name,
        bio: artist.bio || '',
        image_url: artist.imageUrl || '',
        verified: artist.verified
      })
    } else {
      setEditingArtist(null)
      setFormData({
        name: '',
        bio: '',
        image_url: '',
        verified: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingArtist(null)
    setError('')
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const publicUrl = await storageService.uploadFile(file, storageService.COVERS_BUCKET)
      setFormData({ ...formData, image_url: publicUrl })
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload image: ' + error.message)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name) {
      setError('Please enter artist name')
      return
    }

    try {
      const artistData = {
        name: formData.name,
        bio: formData.bio || null,
        imageUrl: formData.image_url || null,
        verified: formData.verified
      }

      if (editingArtist) {
        await artistsService.update(editingArtist.id, artistData)
      } else {
        await artistsService.create(artistData)
      }

      handleCloseModal()
      fetchArtists()
      toast.success(editingArtist ? 'Artist updated successfully!' : 'Artist added successfully!')
    } catch (error) {
      console.error('Artist save error:', error)
      setError('Failed to save artist: ' + error.message)
      toast.error('Failed to save artist: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this artist? This will also delete their songs and albums.')) return

    try {
      await artistsService.delete(id)
      fetchArtists()
      toast.success('Artist deleted successfully!')
    } catch (error) {
      console.error('Failed to delete artist:', error)
      toast.error('Failed to delete artist: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="artists-page">
        <div className="page-header">
          <h2>Artists</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Artist
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading artists...</div>
        ) : (
          <div className="artists-grid">
            {artists.length === 0 ? (
              <p className="no-content">No artists yet. Add your first artist!</p>
            ) : (
              artists.map((artist) => (
                <div key={artist.id} className="artist-card">
                  <img
                    src={artist.imageUrl || 'https://via.placeholder.com/150'}
                    alt={artist.name}
                    className="artist-image"
                  />
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    {artist.verified && (
                      <span className="verified-badge">
                        <Check size={16} /> Verified
                      </span>
                    )}
                    <p className="artist-bio">{artist.bio || 'No bio yet'}</p>
                  </div>
                  <div className="artist-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleOpenModal(artist)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(artist.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</h2>
                <button className="btn-close" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}

                <div className="form-group">
                  <label>Artist Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about the artist..."
                  />
                </div>

                <div className="form-group">
                  <label>Artist Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={uploading}
                    />
                    {uploading && <span>Uploading...</span>}
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Artist" className="cover-preview" />
                    )}
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    />
                    Verified Artist
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingArtist ? 'Update' : 'Create'}
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
