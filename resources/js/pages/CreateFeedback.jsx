import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../services/api'

const CreateFeedback = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const categories = [
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'enhancement', label: 'Enhancement' },
    { value: 'ui', label: 'UI/Design' },
    { value: 'ux', label: 'User Experience' }
  ]

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
      const response = await api.feedbacks.create(formData)
      
      if (response.status === 201) {
        navigate(`/feedback/${response.data.data.id}`)
      }
    } catch (error) {
      console.error('Error creating feedback:', error)
      
      if (error.response?.status === 422) {
        setFieldErrors(error.response.data.errors || {})
        setError('Please check the form for errors')
      } else {
        setError(error.response?.data?.message || 'Failed to create feedback')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Feedback</h1>
          <p className="text-gray-600">Share your ideas, report bugs, or suggest improvements</p>
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
              onClick={() => navigate('/')}
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
                  Creating...
                </div>
              ) : (
                'Create Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFeedback
