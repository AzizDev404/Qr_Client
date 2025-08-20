import api from './api'
const baseURl = import.meta.env.VITE_API_BASE_URL

export const qrService = {
  // QR CRUD operations
  async createQR(data) {
    const response = await api.post('/api/qr/create', data)
    return response.data
  },

  async getQRs(params = {}) {
    const response = await api.get('/api/qr', { params })
    return response.data
  },

  async getQRById(id) {
    const response = await api.get(`/api/qr/${id}`)
    return response.data
  },

  async updateQRContent(id, contentData) {
    let config = {}
    
    // Handle file upload
    if (contentData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      }
    }
    
    const response = await api.put(`/api/qr/${id}/content`, contentData, config)
    return response.data
  },

  async deleteQR(id) {
    const response = await api.delete(`/api/qr/${id}`)
    return response.data
  },

  async restoreQR(id) {
    const response = await api.post(`/api/qr/${id}/restore`)
    return response.data
  },

  async getStats() {
    const response = await api.get('/api/qr/stats')
    return response.data
  },

  // Public endpoints for testing
  async getScanInfo(id) {
    const response = await api.get(`/api/scan-info/${id}`)
    return response.data
  },
  
  // Utility methods
  getQRImageUrl(id) {
    return `${baseURl}/qr-image/${id}`
  },

  getScanUrl(id) {
    return `${api.defaults.baseURL}/scan/${id}`
  },

  getPreviewUrl(id) {
    return `${api.defaults.baseURL}/preview/${id}`
  }
}