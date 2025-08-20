import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import RichTextEditor from '../components/RichTextEditor'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const FeedbackDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [feedback, setFeedback] = useState(null)
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingFeedback, setDeletingFeedback] = useState(false)
  
  // Comment form state
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchFeedback()
    fetchComments()
  }, [id])

  const fetchFeedback = async () => {
    try {
      const response = await api.feedbacks.get(id)
      setFeedback(response.data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      if (error.response?.status === 404) {
        setError('Feedback not found')
      } else {
        setError('Failed to load feedback')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      setCommentsLoading(true)
      const response = await api.comments.list(id)
      const commentList = response.data.data || []
      setComments(commentList)
      setTotalComments(countAllComments(commentList))
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setCommentsLoading(false)
    }
  }

  // Recursively count all comments and replies
  const countAllComments = (commentsArr) => {
    let count = 0
    for (const comment of commentsArr) {
      count += 1
      if (comment.replies && comment.replies.length > 0) {
        count += countAllComments(comment.replies)
      }
    }
    return count
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const commentData = {
        comment: newComment.trim(),
        parent_id: replyTo?.id || null
      }

      await api.comments.create(id, commentData)
      
      // Reset form
      setNewComment('')
      setReplyTo(null)
      
      // Refresh comments
      fetchComments()
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (comment) => {
    setReplyTo(comment)
    setNewComment(`[${comment.user?.name}] `)
  }

  const cancelReply = () => {
    setReplyTo(null)
    setNewComment('')
  }

  const handleDeleteFeedback = async () => {
    if (!window.confirm(`Are you sure you want to delete "${feedback.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingFeedback(true)
      await api.feedbacks.delete(feedback.id)
      
      // Navigate back to home page after successful deletion
      navigate('/')
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('Failed to delete feedback. Please try again.')
    } finally {
      setDeletingFeedback(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      feature: 'bg-blue-100 text-blue-800',
      bug: 'bg-red-100 text-red-800',
      enhancement: 'bg-green-100 text-green-800',
      ui: 'bg-purple-100 text-purple-800',
      ux: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {comment.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-gray-900">{comment.user?.name}</span>
              <span className="text-gray-500 text-sm ml-2">{formatDate(comment.created_at)}</span>
            </div>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={() => handleReply(comment)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Reply
            </button>
          )}
        </div>
        
        <div
          className="text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: comment.comment }}
        ></div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-xl mb-4">Feedback not found</div>
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Feedback Details */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="p-6">
          <div className="sm:flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{feedback.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(feedback.category)}`}>
                  {feedback.category}
                </span>
                <span className="text-gray-600">
                  by {feedback.user?.name || 'Unknown User'}
                </span>
                <span className="text-gray-600">
                  {formatDate(feedback.created_at)}
                </span>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap mb-6">{feedback.description}</div>
            </div>
            
            {/* Owner actions */}
            {isAuthenticated && user && feedback.user_id === user.id && (
              <div className="flex items-center space-x-2 sm:ml-4">
                <Link
                  to={`/feedback/${feedback.id}/edit`}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-md hover:border-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDeleteFeedback}
                  disabled={deletingFeedback}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingFeedback ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to all feedback
            </Link>
            <span className="text-gray-600 text-sm">
              {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        </div>

        <div className="p-6">
          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              {replyTo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-800 text-sm">
                      Replying to <strong>{replyTo.user?.name}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={cancelReply}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <RichTextEditor value={newComment} onChange={setNewComment} />
                <p className="text-gray-500 text-sm mt-1">You can mention users with [Name]</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-600 mb-4">Please log in to add comments</p>
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div>
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackDetail
