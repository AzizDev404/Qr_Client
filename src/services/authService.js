import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token)
    }
    return response.data
  },

  async logout() {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('adminToken')
    }
  },

  async getStatus() {
    try {
      const response = await api.get('/api/auth/status')
      return response.data
    } catch (error) {
      return { authenticated: false }
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('adminToken')
  }
}