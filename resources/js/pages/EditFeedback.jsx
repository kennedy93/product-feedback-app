import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const EditFeedback = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const categories = [
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'enhancement', label: 'Enhancement' },
    { value: 'ui', label: 'UI/Design' },
    { value: 'ux', label: 'User Experience' }
  ]

  useEffect(() => {
    fetchFeedback()
  }, [id])

  const fetchFeedback = async () => {
    try {
      const response = await api.feedbacks.get(id)
      const feedback = response.data
      
      // Check if user owns this feedback
      if (feedback.user_id !== user?.id) {
        setError('You are not authorized to edit this feedback')
        return
      }

      setFormData({
        title: feedback.title,
        description: feedback.description,
        category: feedback.category
      })
    } catch (error) {
      console.error('Error fetching feedback:', error)
      if (error.response?.status === 404) {
        setError('Feedback not found')
      } else if (error.response?.status === 403) {
        setError('You are not authorized to edit this feedback')
      } else {
        setError('Failed to load feedback')
      }
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: null
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      const response = await api.feedbacks.update(id, formData)
      
      if (response.status === 200) {
        navigate(`/feedback/${id}`)
      }
    } catch (error) {
      console.error('Error updating feedback:', error)
      
      if (error.response?.status === 422) {
        setFieldErrors(error.response.data.errors || {})
        setError('Please check the form for errors')
      } else if (error.response?.status === 403) {
        setError('You are not authorized to edit this feedback')
      } else {
        setError(error.response?.data?.message || 'Failed to update feedback')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Feedback</h1>
          <p className="text-gray-600">Update your feedback information</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive title for your feedback"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.category[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                fieldErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about your feedback. Be as specific as possible to help us understand your request."
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description[0]}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Minimum 10 characters. You can mention users using @username.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(`/feedback/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFeedback
