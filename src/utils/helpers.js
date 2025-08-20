// utils/helpers.js
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

export const normalizeUrl = (url) => {
  if (!url) return ''
  
  // Email uchun
  if (url.includes('@') && !url.startsWith('mailto:')) {
    return 'mailto:' + url
  }
  
  // Telefon uchun  
  if (url.startsWith('+') || /^\d+$/.test(url.replace(/[\s\-\(\)]/g, ''))) {
    return 'tel:' + url.replace(/[\s\-\(\)]/g, '')
  }
  
  // Website uchun
  if (!url.startsWith('http://') && !url.startsWith('https://') && 
      !url.startsWith('mailto:') && !url.startsWith('tel:') && 
      !url.startsWith('ftp:')) {
    return 'https://' + url
  }
  
  return url
}

export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️'
  if (fileType.startsWith('video/')) return '🎥'
  if (fileType.startsWith('audio/')) return '🎵'
  if (fileType.includes('pdf')) return '📄'
  if (fileType.includes('word')) return '📝'
  if (fileType.includes('excel')) return '📊'
  if (fileType.includes('powerpoint')) return '📋'
  return '📁'
}

export const getContentTypeIcon = (contentType) => {
  switch (contentType) {
    case 'text': return '📝'
    case 'link': return '🔗'
    case 'file': return '📁' 
    case 'contact': return '👤'
    default: return '❓'
  }
}

export const generateRandomId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const isValidJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}