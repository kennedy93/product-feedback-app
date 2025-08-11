import axios from 'axios'

// Set base URL for API calls
axios.defaults.baseURL = window.location.origin

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if we're not already on a public page
      if (!['/login', '/register', '/'].includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => axios.post('/api/login', credentials),
    register: (userData) => axios.post('/api/register', userData),
    logout: () => axios.post('/api/logout'),
    user: () => axios.get('/api/user'),
  },

  // Product Feedback endpoints
  feedbacks: {
    list: (page = 1) => axios.get(`/api/product-feedbacks?page=${page}`),
    get: (id) => axios.get(`/api/product-feedbacks/${id}`),
    create: (data) => axios.post('/api/product-feedbacks', data),
    update: (id, data) => axios.put(`/api/product-feedbacks/${id}`, data),
    delete: (id) => axios.delete(`/api/product-feedbacks/${id}`),
  },

  // Comments endpoints
  comments: {
    list: (feedbackId, page = 1) => axios.get(`/api/product-feedbacks/${feedbackId}/comments?page=${page}`),
    get: (feedbackId, commentId) => axios.get(`/api/product-feedbacks/${feedbackId}/comments/${commentId}`),
    create: (feedbackId, data) => axios.post(`/api/product-feedbacks/${feedbackId}/comments`, data),
    update: (feedbackId, commentId, data) => axios.put(`/api/product-feedbacks/${feedbackId}/comments/${commentId}`, data),
    delete: (feedbackId, commentId) => axios.delete(`/api/product-feedbacks/${feedbackId}/comments/${commentId}`),
  },

  // Mentions endpoints
  mentions: {
    list: (page = 1) => axios.get(`/api/mentions?page=${page}`),
    unread: (page = 1) => axios.get(`/api/mentions/unread?page=${page}`),
    stats: () => axios.get('/api/mentions/stats'),
    get: (id) => axios.get(`/api/mentions/${id}`),
    markAsRead: (id) => axios.patch(`/api/mentions/${id}/read`),
    markAllAsRead: () => axios.post('/api/mentions/mark-all-read'),
  },
}

export default api
