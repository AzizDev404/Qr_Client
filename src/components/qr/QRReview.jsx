// components/qr/QRPreview.jsx
import React, { useState, useEffect } from 'react'
import { qrService } from '../../services/qrService'
import { Eye, ExternalLink, RefreshCw } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const QRPreview = ({ qrId, className = '' }) => {
  const [previewData, setPreviewData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (qrId) {
      loadPreviewData()
    }
  }, [qrId])

  const loadPreviewData = async () => {
    if (!qrId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await qrService.getScanInfo(qrId)
      setPreviewData(response)
    } catch (error) {
      setError('Preview ma\'lumotlarini yuklashda xatolik')
      console.error('Preview load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenPreview = () => {
    const previewUrl = qrService.getPreviewUrl(qrId)
    window.open(previewUrl, '_blank')
  }

  if (!qrId) {
    return (
      <div className={`qr-preview ${className}`}>
        <p className="text-gray-500">QR kod tanlanmagan</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`qr-preview ${className}`}>
        <LoadingSpinner size="md" />
        <p className="text-gray-500 mt-2">Yuklanmoqda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`qr-preview ${className}`}>
        <p className="text-red-500 mb-3">{error}</p>
        <button
          onClick={loadPreviewData}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Qayta yuklash</span>
        </button>
      </div>
    )
  }

  if (!previewData) {
    return (
      <div className={`qr-preview ${className}`}>
        <p className="text-gray-500">Preview ma'lumotlari topilmadi</p>
      </div>
    )
  }

  return (
    <div className={`qr-preview active ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">QR Preview</h4>
          <button
            onClick={handleOpenPreview}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Yangi oynada ochish"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">Sarlavha:</span>
            <p className="font-medium">{previewData.title}</p>
          </div>

          {previewData.description && (
            <div>
              <span className="text-sm text-gray-600">Tavsif:</span>
              <p className="text-gray-800">{previewData.description}</p>
            </div>
          )}

          <div>
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              previewData.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {previewData.status === 'active' ? 'Faol' : 'O\'chirilgan'}
            </span>
          </div>

          {previewData.contentType && (
            <div>
              <span className="text-sm text-gray-600">Content Turi:</span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {previewData.contentType}
              </span>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <span>Scan Count: </span>
            <span className="font-medium">{previewData.scanCount || 0}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={handleOpenPreview}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>To'liq ko'rish</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRPreview