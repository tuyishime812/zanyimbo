import { useState, useEffect } from 'react'
import { Heart, MessageSquare, MoreVertical, Edit, Trash2, Flag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Comments.css'

export default function Comments({ songId, onCommentCountChange }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { showToast } = useToast()

  // Load comments
  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('song_comments')
        .select(`
          *,
          comment_likes (
            count
          )
        `)
        .eq('song_id', songId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user details for each comment
      const commentsWithUsers = await Promise.all(
        data.map(async (comment) => {
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .single()

          return {
            ...comment,
            user: userData || { username: 'Anonymous', avatar_url: null }
          }
        })
      )

      setComments(commentsWithUsers)
      if (onCommentCountChange) {
        onCommentCountChange(data.length)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      showToast('Failed to load comments', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (songId) {
      loadComments()
    }
  }, [songId])

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      showToast('Please login to comment', 'warning')
      return
    }

    if (!newComment.trim()) {
      showToast('Please enter a comment', 'warning')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('song_comments')
        .insert({
          song_id: songId,
          user_id: user.uid,
          content: newComment.trim(),
          rating: rating
        })

      if (error) throw error

      showToast('Comment added', 'success')
      setNewComment('')
      setRating(5)
      await loadComments()
    } catch (error) {
      console.error('Error posting comment:', error)
      showToast('Failed to post comment', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('song_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.uid)

      if (error) throw error

      showToast('Comment deleted', 'success')
      await loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      showToast('Failed to delete comment', 'error')
    }
  }

  // Like comment
  const handleLike = async (commentId) => {
    if (!user) {
      showToast('Please login to like comments', 'warning')
      return
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('comment_likes')
        .select()
        .eq('comment_id', commentId)
        .eq('user_id', user.uid)
        .single()

      if (existing) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.uid)
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.uid
          })
      }

      await loadComments()
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  // Render stars for rating
  const renderStars = (count) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= count ? 'filled' : ''}`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        <MessageSquare size={20} />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-rating">{renderStars(rating)}</div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this song..."
            rows={3}
            className="comment-input"
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <MessageSquare size={48} />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {comment.user.avatar_url ? (
                  <img src={comment.user.avatar_url} alt={comment.user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.user.username}</span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>

                {comment.rating && (
                  <div className="comment-rating-display">
                    {renderStars(comment.rating)}
                  </div>
                )}

                <p className="comment-text">{comment.content}</p>

                <div className="comment-actions">
                  <button
                    className="action-btn like"
                    onClick={() => handleLike(comment.id)}
                  >
                    <Heart size={16} />
                    <span>{comment.comment_likes?.count || 0}</span>
                  </button>
                  
                  <button className="action-btn reply">
                    Reply
                  </button>

                  {user && user.uid === comment.user_id && (
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <button className="action-btn flag">
                    <Flag size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
