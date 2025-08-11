import React from 'react'
import { Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import FeedbackDetail from './pages/FeedbackDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateFeedback from './pages/CreateFeedback'
import EditFeedback from './pages/EditFeedback'
import Profile from './pages/Profile'

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateFeedback />
              </ProtectedRoute>
            } />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route path="/feedback/:id/edit" element={
              <ProtectedRoute>
                <EditFeedback />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
