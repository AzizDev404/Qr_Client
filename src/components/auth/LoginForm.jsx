// components/auth/LoginForm.jsx - Password hide/show ishlaydi
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const   LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuth()
  const { error: showError } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username majburiy'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Parol majburiy'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const result = await login(formData)
      
      if (!result.success) {
        showError(result.message || 'Login xatolik yuz berdi')
      }
    } catch (error) {
      console.error('Login error:', error)
      showError(error.message || 'Login xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Dynamic QR Code Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`
                    appearance-none relative block w-full pl-10 pr-3 py-2 border
                    ${errors.username ? 'border-red-500' : 'border-gray-300'}
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                    transition-colors
                  `}
                  placeholder="Username kiriting"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Parol
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    appearance-none relative block w-full pl-10 pr-12 py-2 border
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                    placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none 
                    focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                    transition-colors
                  `}
                  placeholder="Parol kiriting"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-gray-100 rounded-r-lg transition-colors"
                  onClick={togglePasswordVisibility}
                  onMouseDown={(e) => e.preventDefault()} // Form submit bo'lmasligi uchun
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Tekshirilmoqda...</span>
                </div>
              ) : (
                'Kirish'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm