// utils/constants.js
export const CONTENT_TYPES = {
  TEXT: 'text',
  LINK: 'link', 
  FILE: 'file',
  CONTACT: 'contact'
}

export const CONTENT_TYPE_LABELS = {
  [CONTENT_TYPES.TEXT]: 'Matn',
  [CONTENT_TYPES.LINK]: 'Havola',
  [CONTENT_TYPES.FILE]: 'Fayl',
  [CONTENT_TYPES.CONTACT]: 'Kontakt'
}

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
}

export const QR_STATUS = {
  ACTIVE: 'active',
  DELETED: 'deleted'
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/avi', 'video/mov', 'video/webm',
  'audio/mp3', 'audio/wav', 'audio/aac',
  'application/pdf', 'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  STATUS: '/api/auth/status',
  
  // QR
  QR_CREATE: '/api/qr/create',
  QR_LIST: '/api/qr',
  QR_GET: (id) => `/api/qr/${id}`,
  QR_UPDATE: (id) => `/api/qr/${id}/content`,
  QR_DELETE: (id) => `/api/qr/${id}`,
  QR_RESTORE: (id) => `/api/qr/${id}/restore`,
  QR_STATS: '/api/qr/stats',
  
  // Public
  SCAN: (id) => `/scan/${id}`,
  PREVIEW: (id) => `/preview/${id}`,
  QR_IMAGE: (id) => `/qr-image/${id}`,
  SCAN_INFO: (id) => `/api/scan-info/${id}`
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}