import { useState, useEffect } from 'react'
import { albumsService, artistsService } from '../../lib/supabaseDatabase'
import { storageService } from '../../lib/storage'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import './Albums.css'

export default function AdminAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    cover_url: '',
    release_date: '',
    featured: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const albumsData = await albumsService.getAll()
      setAlbums(albumsData || [])
    } catch (error) {
      console.error('Error fetching albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (album = null) => {
    if (album) {
      setEditingAlbum(album)
      setFormData({
        title: album.title,
        artist_name: album.artistName || '',
        cover_url: album.coverUrl || '',
        release_date: album.releaseDate || '',
        featured: album.featured
      })
    } else {
      setEditingAlbum(null)
      setFormData({
        title: '',
        artist_name: '',
        cover_url: '',
        release_date: '',
        featured: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAlbum(null)
    setError('')
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

    if (!formData.title || !formData.artist_name) {
      setError('Please fill in required fields')
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

      const albumData = {
        title: formData.title,
        artistId: artistId,
        artistName: formData.artist_name,
        coverUrl: formData.cover_url || null,
        releaseDate: formData.release_date || null,
        featured: formData.featured,
        trackCount: 0
      }

      if (editingAlbum) {
        await albumsService.update(editingAlbum.id, albumData)
      } else {
        await albumsService.create(albumData)
      }

      handleCloseModal()
      fetchAlbums()
      toast.success(editingAlbum ? 'Album updated successfully!' : 'Album added successfully!')
    } catch (error) {
      console.error('Album save error:', error)
      toast.error('Failed to save album: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this album?')) return

    try {
      await albumsService.delete(id)
      fetchAlbums()
      toast.success('Album deleted successfully!')
    } catch (error) {
      console.error('Failed to delete album:', error)
      toast.error('Failed to delete album: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="albums-page">
        <div className="page-header">
          <h2>Albums</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Album
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading albums...</div>
        ) : (
          <div className="albums-grid">
            {albums.length === 0 ? (
              <p className="no-content">No albums yet. Add your first album!</p>
            ) : (
              albums.map((album) => (
                <div key={album.id} className="album-card">
                  <img
                    src={album.coverUrl || 'https://via.placeholder.com/200'}
                    alt={album.title}
                    className="album-cover"
                  />
                  <div className="album-info">
                    <h3>{album.title}</h3>
                    <p>{album.artistName || 'Unknown Artist'}</p>
                    <div className="album-meta">
                      <span>{album.trackCount || 0} tracks</span>
                      {album.releaseDate && (
                        <span>{new Date(album.releaseDate).getFullYear()}</span>
                      )}
                      {album.featured && <span className="badge">Featured</span>}
                    </div>
                  </div>
                  <div className="album-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleOpenModal(album)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(album.id)}
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
                <h2>{editingAlbum ? 'Edit Album' : 'Add New Album'}</h2>
                <button className="btn-close" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}

                <div className="form-group">
                  <label>Album Title *</label>
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
                  <label>Release Date</label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  />
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
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingAlbum ? 'Update' : 'Create'}
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
