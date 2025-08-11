import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      // Token will be handled by the API service interceptors
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.auth.user()
          setUser(response.data.data)
        } catch (error) {
          console.error('Auth check failed:', error)
          logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password })
      const { token, user } = response.data.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await api.auth.register({
        name,
        email,
        password,
        password_confirmation
      })
      
      const { token, user } = response.data.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      }
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await api.auth.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
