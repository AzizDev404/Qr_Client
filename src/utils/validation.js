// utils/validation.js
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants'

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7
}

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    
    // Qo'llab-quvvatlanadigan protocollar
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:']
    
    return allowedProtocols.includes(urlObj.protocol) && urlObj.hostname.length > 0
  } catch {
    return false
  }
}

export const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
  return file && file.size <= maxSize
}

export const validateFileType = (file, allowedTypes = ALLOWED_FILE_TYPES) => {
  return file && allowedTypes.includes(file.type)
}

export const getValidationErrors = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const value = data[field]
    const fieldRules = rules[field]
    
    fieldRules.forEach(rule => {
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.message || `${field} majburiy`
        return
      }
      
      if (rule.email && value && !validateEmail(value)) {
        errors[field] = rule.message || 'Noto\'g\'ri email format'
        return
      }
      
      if (rule.url && value && !validateUrl(value)) {
        errors[field] = rule.message || 'Noto\'g\'ri URL format'
        return
      }
      
      if (rule.phone && value && !validatePhone(value)) {
        errors[field] = rule.message || 'Noto\'g\'ri telefon format'
        return
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = rule.message || `Kamida ${rule.minLength} belgi kerak`
        return
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors[field] = rule.message || `Maksimal ${rule.maxLength} belgi`
        return
      }
    })
  })
  
  return errors
}