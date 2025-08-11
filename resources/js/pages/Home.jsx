import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [deletingFeedback, setDeletingFeedback] = useState(null)

  useEffect(() => {
    fetchFeedbacks(currentPage)
  }, [currentPage])

  const fetchFeedbacks = async (page = 1) => {
    try {
      setLoading(true)
      const response = await api.feedbacks.list(page)
      setFeedbacks(response.data.data)
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      })
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      setError('Failed to load feedbacks')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const handleDeleteFeedback = async (feedbackId, feedbackTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${feedbackTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingFeedback(feedbackId)
      await api.feedbacks.delete(feedbackId)
      
      // Remove the deleted feedback from the list
      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(f => f.id !== feedbackId))
      
      // Update pagination total
      if (pagination) {
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }))
      }
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('Failed to delete feedback. Please try again.')
    } finally {
      setDeletingFeedback(null)
    }
  }

  if (loading && feedbacks.length === 0) {
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
        <button 
          onClick={() => fetchFeedbacks(currentPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="md:flex justify-between items-center mb-8">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Feedback</h1>
          <p className="text-gray-600">Share your ideas and help us improve our product</p>
        </div>
        
        {isAuthenticated && (
          <Link 
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-nowrap block md:inline-block text-center md:text-left"
          >
            + Add Feedback
          </Link>
        )}
      </div>

      {/* Feedbacks List */}
      {feedbacks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-xl mb-4">No feedbacks yet</div>
          {isAuthenticated ? (
            <Link 
              to="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Create the first feedback
            </Link>
          ) : (
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login to create feedback
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link 
                      to={`/feedback/${feedback.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 block"
                    >
                      {feedback.title}
                    </Link>
                    <p className="text-gray-600 mb-3 line-clamp-3">{feedback.description}</p>
                  </div>
                  
                  {/* Owner actions */}
                  {isAuthenticated && user && feedback.user_id === user.id && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/feedback/${feedback.id}/edit`}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-2"
                        title="Edit feedback"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteFeedback(feedback.id, feedback.title)}
                        disabled={deletingFeedback === feedback.id}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2 disabled:opacity-50"
                        title="Delete feedback"
                      >
                        {deletingFeedback === feedback.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="sm:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getCategoryColor(feedback.category)}`}>
                      {feedback.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {feedback.user?.name || 'Unknown User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between sm:space-x-4 sm:mt-0 mt-4">
                    <span className="text-sm text-gray-500 text-nowrap">
                      {feedback.comments?.length || 0} comments
                    </span>
                    <Link 
                      to={`/feedback/${feedback.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm text-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setCurrentPage(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          
          <button
            onClick={() => setCurrentPage(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
