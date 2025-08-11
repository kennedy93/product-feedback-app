import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const Profile = () => {
  const { user } = useAuth()
  const [mentions, setMentions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      
      // Fetch mentions and stats in parallel
      const [mentionsResponse, statsResponse] = await Promise.all([
        api.mentions.list(1),
        api.mentions.stats()
      ])
      
      setMentions(mentionsResponse.data.data || [])
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markMentionAsRead = async (mentionId) => {
    try {
      await api.mentions.markAsRead(mentionId)
      // Refresh the data
      fetchProfileData()
    } catch (error) {
      console.error('Error marking mention as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.mentions.markAllAsRead()
      fetchProfileData()
    } catch (error) {
      console.error('Error marking all mentions as read:', error)
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total_mentions}</div>
            <div className="text-gray-600">Total Mentions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.unread_mentions}</div>
            <div className="text-gray-600">Unread Mentions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.read_mentions}</div>
            <div className="text-gray-600">Read Mentions</div>
          </div>
        </div>
      )}

      {/* Mentions Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Mentions</h2>
            {stats && stats.unread_mentions > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : mentions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No mentions yet</div>
              <p className="text-gray-400">When someone mentions you in a comment, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mentions.slice(0, 10).map((mention) => (
                <div 
                  key={mention.id} 
                  className={`border rounded-lg p-4 ${mention.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{mention.mentioned_by_user?.name}</span> mentioned you in a comment on{' '}
                        <span className="font-medium">"{mention.comment?.product_feedback?.title}"</span>
                      </p>
                      <p className="text-gray-800 text-sm bg-white p-2 rounded border">
                        {mention.comment?.comment}
                      </p>
                    </div>
                    {!mention.is_read && (
                      <button
                        onClick={() => markMentionAsRead(mention.id)}
                        className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(mention.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
