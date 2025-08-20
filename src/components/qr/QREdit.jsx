// components/qr/QREdit.jsx
import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import QRContentEditor from './QRContentEditor'
import { qrService } from '../../services/qrService'
import { useToast } from '../../context/ToastContext'
import { QrCode, Edit3, Eye, Copy, ExternalLink } from 'lucide-react'
import { copyToClipboard, formatDate } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const QREdit = ({ isOpen, onClose, qr, onSuccess }) => {
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  const { success: showSuccess, error: showError } = useToast()

  useEffect(() => {
    if (isOpen && qr) {
      loadQRDetails()
    }
  }, [isOpen, qr])

  const loadQRDetails = async () => {
    if (!qr?._id) return
    
    setLoading(true)
    try {
      const response = await qrService.getQRById(qr._id)
      setQrData(response)
    } catch (error) {
      showError('QR kod ma\'lumotlarini yuklashda xatolik')
      console.error('Load QR details error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContentUpdate = async (contentData) => {
    try {
      const response = await qrService.updateQRContent(qr._id, contentData)
      setQrData(prev => ({
        ...prev,
        ...response
      }))
      showSuccess('Content muvaffaqiyatli yangilandi')
      onSuccess(response)
    } catch (error) {
      showError(error.response?.data?.message || 'Content yangilashda xatolik')
      throw error
    }
  }

  const handleCopyUrl = async () => {
    const url = qrService.getScanUrl(qr._id)
    const success = await copyToClipboard(url)
    if (success) {
      showSuccess('URL nusxalandi')
    } else {
      showError('URL nusxalashda xatolik')
    }
  }

  const handlePreview = () => {
    const previewUrl = qrService.getPreviewUrl(qr._id)
    window.open(previewUrl, '_blank')
  }

  const handleClose = () => {
    setQrData(null)
    setActiveTab('content')
    onClose()
  }

  if (!qr) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`QR Kod Tahrirlash: ${qr.title}`}
      size="lg"
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Content Tahrirlash
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Ma'lumotlari
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'content' ? (
            <QRContentEditor
              qr={qrData || qr}
              onUpdate={handleContentUpdate}
            />
          ) : (
            <div className="space-y-6">
              {/* QR Code Preview */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <img
                      src={qrService.getQRImageUrl(qr._id)}
                      alt={`QR Code for ${qr.title}`}
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{qr.title}</h3>
                    {qr.description && (
                      <p className="text-gray-600 mt-1">{qr.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        qr.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {qr.status === 'active' ? 'Faol' : 'O\'chirilgan'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Scan Count:</span>
                      <span className="ml-2 font-medium">{qrData?.scanCount || qr.scanCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Yaratilgan:</span>
                      <span className="ml-2">{formatDate(qr.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">O\'zgartirilgan:</span>
                      <span className="ml-2">{formatDate(qrData?.updatedAt || qr.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePreview}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Eye size={16} />
                      <span>Ko'rish</span>
                    </button>
                    <button
                      onClick={handleCopyUrl}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Copy size={16} />
                      <span>URL Nusxalash</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* URLs */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">QR Kod URLlari</h4>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Scan URL:</span>
                    <div className="mt-1 p-2 bg-white rounded border text-xs font-mono break-all">
                      {qrService.getScanUrl(qr._id)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Preview URL:</span>
                    <div className="mt-1 p-2 bg-white rounded border text-xs font-mono break-all">
                      {qrService.getPreviewUrl(qr._id)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">QR Image URL:</span>
                    <div className="mt-1 p-2 bg-white rounded border text-xs font-mono break-all">
                      {qrService.getQRImageUrl(qr._id)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Info */}
              {qrData?.contentType && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Joriy Content</h4>
                  <div className="text-sm text-blue-800">
                    <p><strong>Tur:</strong> {qrData.contentType}</p>
                    {qrData.contentType === 'text' && qrData.text && (
                      <p><strong>Matn:</strong> {qrData.text.substring(0, 100)}...</p>
                    )}
                    {qrData.contentType === 'link' && qrData.url && (
                      <p><strong>URL:</strong> {qrData.url}</p>
                    )}
                    {qrData.contentType === 'file' && qrData.fileName && (
                      <p><strong>Fayl:</strong> {qrData.fileName}</p>
                    )}
                    {qrData.contentType === 'contact' && qrData.contactName && (
                      <p><strong>Kontakt:</strong> {qrData.contactName}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default QREdit