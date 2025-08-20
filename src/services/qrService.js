// services/qrService.js - To'g'irlangan versiya
import api from './api'

const baseURL = import.meta.env.VITE_API_BASE_URL 

export const qrService = {
  // QR CRUD operations
  async createQR(data) {
    try {
      const response = await api.post('/api/qr/create', data)
      return response.data
    } catch (error) {
      console.error('Create QR error:', error)
      throw error
    }
  },

  async getQRs(params = {}) {
    try {
      const response = await api.get('/api/qr', { params })
      return response.data
    } catch (error) {
      console.error('Get QRs error:', error)
      throw error
    }
  },

  async getQRById(id) {
    try {
      const response = await api.get(`/api/qr/${id}`)
      return response.data
    } catch (error) {
      console.error('Get QR by ID error:', error)
      throw error
    }
  },

  async updateQRContent(id, contentData) {
    console.log('=== QR SERVICE UPDATE CONTENT ===')
    console.log('QR ID:', id)
    console.log('Content Data:', contentData)
    console.log('Content Data Type:', typeof contentData)
    console.log('Is FormData:', contentData instanceof FormData)
    
    try {
      let config = {}
      let payload = contentData
      
      // Handle file upload (FormData)
      if (contentData instanceof FormData) {
        console.log('Processing FormData request')
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
        payload = contentData
      } else {
        console.log('Processing JSON request')
        
        // Validate required fields based on content type
        if (!contentData.contentType) {
          throw new Error('ContentType majburiy')
        }
        
        // File content uchun validation - FormData bo'lmasa va mavjud fayl yo'q bo'lsa
        if (contentData.contentType === 'file') {
          // Yangi fayl yuklash yoki mavjud fayl ma'lumotlari bo'lishi kerak
          const hasNewFile = contentData.file
          const hasExistingFile = contentData.fileName || contentData.filePath
          
          if (!hasNewFile && !hasExistingFile) {
            throw new Error('File content uchun fayl yuklash majburiy!')
          }
          
          console.log('File validation passed:', { hasNewFile, hasExistingFile })
        }
        
        config.headers = {
          'Content-Type': 'application/json'
        }
        
        // Backend format - contentType alohida yuborish
        payload = {
          contentType: contentData.contentType,
          ...contentData
        }
        
        // Duplicate contentType ni olib tashlash
        const payloadCopy = { ...payload }
        delete payloadCopy.contentType
        
        // Final structured format
        payload = {
          contentType: contentData.contentType,
          content: payloadCopy
        }
        
        console.log('Using structured JSON format:', payload)
      }
      
      console.log('Final payload:', payload)
      console.log('Request config:', config)
      
      const response = await api.put(`/api/qr/${id}/content`, payload, config)
      
      console.log('Update response:', response.data)
      return response.data
      
    } catch (error) {
      console.error('=== UPDATE QR CONTENT ERROR ===')
      console.error('Error status:', error.response?.status)
      console.error('Error message:', error.response?.data?.message || error.message)
      console.error('Error data:', error.response?.data)
      
      // Custom error handling
      if (error.message === 'File content uchun fayl yuklash majburiy!') {
        throw new Error('File content uchun avval fayl yuklang!')
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
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
    return `${baseURL}/qr-image/${id}`
  },

  getScanUrl(id) {
    // API base URL dan scan URL yaratish
    const apiBaseURL = api.defaults.baseURL || baseURL
    return `${apiBaseURL}/scan/${id}`.replace('/api', '') // /api ni olib tashlash
  },

  getPreviewUrl(id) {
    // API base URL dan preview URL yaratish  
    const apiBaseURL = api.defaults.baseURL || baseURL
    return `${apiBaseURL}/preview/${id}`.replace('/api', '') // /api ni olib tashlash
  },

  // Debug helper method
  async debugUpdateContent(id, contentData) {
    console.log('=== DEBUG UPDATE CONTENT ===')
    
    const formats = [
      // Format 1: Structured
      {
        name: 'Structured Format',
        payload: {
          contentType: contentData.contentType,
          content: { ...contentData }
        }
      },
      // Format 2: Direct
      {
        name: 'Direct Format', 
        payload: contentData
      },
      // Format 3: Simple (without contentType)
      {
        name: 'Simple Format',
        payload: (() => {
          const simple = { ...contentData }
          delete simple.contentType
          return simple
        })()
      }
    ]
    
    for (const format of formats) {
      console.log(`Testing ${format.name}:`, format.payload)
      
      try {
        const response = await api.put(`/api/qr/${id}/content`, format.payload)
        console.log(`${format.name} SUCCESS:`, response.data)
        return { success: true, format: format.name, data: response.data }
      } catch (error) {
        console.log(`${format.name} FAILED:`, error.response?.data)
      }
    }
    
    return { success: false, message: 'All formats failed' }
  }
}