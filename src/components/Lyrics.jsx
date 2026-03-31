import { useState, useEffect } from 'react'
import { Music, Edit, Save, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Lyrics.css'

export default function Lyrics({ songId, isAdmin = false }) {
  const [lyrics, setLyrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  // Load lyrics
  const loadLyrics = async () => {
    try {
      const { data, error } = await supabase
        .from('song_lyrics')
        .select('*')
        .eq('song_id', songId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setLyrics(data || null)
    } catch (error) {
      console.error('Error loading lyrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (songId) {
      loadLyrics()
    }
  }, [songId])

  // Save lyrics
  const handleSave = async () => {
    if (!editValue.trim()) {
      showToast('Lyrics cannot be empty', 'warning')
      return
    }

    setSaving(true)
    try {
      if (lyrics) {
        // Update existing
        const { error } = await supabase
          .from('song_lyrics')
          .update({
            lyrics: editValue.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('song_id', songId)

        if (error) throw error
        showToast('Lyrics updated', 'success')
      } else {
        // Insert new
        const { error } = await supabase
          .from('song_lyrics')
          .insert({
            song_id: songId,
            lyrics: editValue.trim(),
            created_by: user?.uid
          })

        if (error) throw error
        showToast('Lyrics added', 'success')
      }

      await loadLyrics()
      setEditing(false)
    } catch (error) {
      console.error('Error saving lyrics:', error)
      showToast('Failed to save lyrics', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Delete lyrics
  const handleDelete = async () => {
    if (!isAdmin) return

    try {
      const { error } = await supabase
        .from('song_lyrics')
        .delete()
        .eq('song_id', songId)

      if (error) throw error
      
      showToast('Lyrics deleted', 'success')
      setLyrics(null)
      setEditing(false)
    } catch (error) {
      console.error('Error deleting lyrics:', error)
      showToast('Failed to delete lyrics', 'error')
    }
  }

  if (loading) {
    return (
      <div className="lyrics-container loading">
        <Music size={24} />
        <p>Loading lyrics...</p>
      </div>
    )
  }

  return (
    <div className="lyrics-container">
      <div className="lyrics-header">
        <div className="lyrics-title">
          <Music size={20} />
          <h3>Lyrics</h3>
        </div>
        
        {isAdmin && (
          <div className="lyrics-actions">
            {editing ? (
              <>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setEditing(false)
                    setEditValue(lyrics?.lyrics || '')
                  }}
                  disabled={saving}
                >
                  <X size={18} />
                </button>
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditValue(lyrics?.lyrics || '')
                    setEditing(true)
                  }}
                >
                  <Edit size={18} />
                  {lyrics ? 'Edit' : 'Add'} Lyrics
                </button>
                {lyrics && (
                  <button
                    className="btn-delete"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="lyrics-content">
        {editing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter song lyrics here..."
            className="lyrics-editor"
            rows={20}
          />
        ) : lyrics ? (
          <div className="lyrics-text">
            {lyrics.lyrics.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ) : (
          <div className="no-lyrics">
            <Music size={48} />
            <p>No lyrics available</p>
            {isAdmin && (
              <span className="hint">Click "Add Lyrics" to add</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
