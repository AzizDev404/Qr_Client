// services/qrService.js - Backend formatiga moslashtirilgan
import api from './api'

export const qrService = {
  // QR CRUD operations
  async createQR(data) {
    try {
      const response = await api.post('/api/qr/create', data)
      console.log('Create QR response:', response.data)
      return response.data
    } catch (error) {
      console.error('Create QR error:', error)
      throw error
    }
  },

  async getQRs(params = {}) {
    try {
      const response = await api.get('/api/qr', { params })
      console.log('Get QRs response:', response.data)
      return response.data
    } catch (error) {
      console.error('Get QRs error:', error)
      throw error
    }
  },

  async getQRById(id) {
    try {
      const response = await api.get(`/api/qr/${id}`)
      console.log('Get QR by ID response:', response.data)
      
      // Backend format ni frontend format ga convert qilish
      const qr = response.data
      const normalizedQR = {
        _id: qr.id || qr._id,  // Frontend _id kutadi
        id: qr.id || qr._id,   // Backup
        title: qr.title,
        description: qr.description,
        status: qr.isActive ? 'active' : 'deleted',
        contentType: qr.currentContent?.contentType,
        createdAt: qr.createdDate || qr.createdAt,
        updatedAt: qr.updatedAt || qr.lastModified,
        scanCount: qr.scanCount || 0,
        isActive: qr.isActive,
        // Backend content ni flatten qilish
        ...qr.currentContent,
        // Backend URLs
        scanUrl: qr.scanUrl,
        qrImageUrl: qr.qrImageUrl
      }
      
      console.log('Normalized QR for frontend:', normalizedQR)
      return normalizedQR
    } catch (error) {
      console.error('Get QR by ID error:', error)
      throw error
    }
  },

  async updateQRContent(id, contentData) {
    let config = {
      headers: {}
    }
    
    // Handle file upload
    if (contentData instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    
    console.log('Updating QR content:')
    console.log('QR ID:', id)
    console.log('Content Data:', contentData)
    console.log('Headers:', config.headers)
    
    try {
      const response = await api.put(`/api/qr/${id}/content`, contentData, config)
      console.log('Update success:', response.data)
      
      // Backend response ni normalize qilish
      const updatedQR = response.data
      const normalizedResponse = {
        _id: updatedQR.id || id,
        id: updatedQR.id || id,
        contentType: updatedQR.currentContent?.contentType || updatedQR.contentType,
        // Backend content ni flatten qilish
        ...updatedQR.currentContent,
        ...updatedQR
      }
      
      return normalizedResponse
    } catch (error) {
      console.error('Update QR content error:', error)
      
      // Backend dan kelgan xatolik xabarini extract qilish
      if (error.response?.data) {
        console.error('Backend error response:', error.response.data)
        
        // Xatolik xabarini qaytarish
        const errorMessage = error.response.data.message || 
                            error.response.data.error || 
                            `HTTP ${error.response.status} xatolik`
        
        const customError = new Error(errorMessage)
        customError.response = error.response
        throw customError
      }
      
      throw error
    }
  },

  async deleteQR(id) {
    try {
      const response = await api.delete(`/api/qr/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete QR error:', error)
      throw error
    }
  },

  async restoreQR(id) {
    try {
      const response = await api.post(`/api/qr/${id}/restore`)
      return response.data
    } catch (error) {
      console.error('Restore QR error:', error)
      throw error
    }
  },

  async getStats() {
    try {
      const response = await api.get('/api/qr/stats')
      return response.data
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  },

  // Public endpoints for testing
  async getScanInfo(id) {
    try {
      const response = await api.get(`/api/scan-info/${id}`)
      return response.data
    } catch (error) {
      console.error('Get scan info error:', error)
      throw error
    }
  },

  // Utility methods
  getQRImageUrl(id) {
    const baseURL = api.defaults.baseURL || 'http://localhost:3001'
    return `${baseURL}/qr-image/${id}`
  },

  getScanUrl(id) {
    const baseURL = api.defaults.baseURL || 'http://localhost:3001'
    return `${baseURL}/scan/${id}`
  },

  getPreviewUrl(id) {
    const baseURL = api.defaults.baseURL || 'http://localhost:3001'
    return `${baseURL}/preview/${id}`
  },

  // Helper method to test connection
  async testConnection() {
    try {
      const response = await api.get('/api/auth/status')
      return response.data
    } catch (error) {
      console.error('Connection test failed:', error)
      throw error
    }
  }
}