// components/qr/QRCard.jsx - Backend formatiga moslashtirilgan
import React, { useState } from 'react'
import { 
  QrCode, Eye, Edit3, Trash2, RotateCcw, Copy, ExternalLink,
  Calendar, Activity, FileText, Link, User, Folder
} from 'lucide-react'
import { qrService } from '../../services/qrService'
import { useToast } from '../../context/ToastContext'
import { formatDate, copyToClipboard, getContentTypeIcon } from '../../utils/helpers'
import ConfirmDialog from '../common/ConfirmDialog'

const QRCard = ({ qr, onEdit, onDelete, onRestore }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const { success: showSuccess, error: showError } = useToast()

  // Backend format field mapping
  const qrId = qr?.id || qr?._id
  const qrTitle = qr?.title
  const qrStatus = qr?.isActive ? 'active' : 'deleted'
  const qrCreatedAt = qr?.createdDate || qr?.createdAt
  const qrScanCount = qr?.scanCount || 0
  const qrContentType = qr?.currentContent?.type
  const qrDescription = qr?.currentContent?.description
  const qrScanUrl = qr?.scanUrl
  const qrImageUrl = qr?.qrImageUrl

  // Debug: QR obyektini log qilish
  React.useEffect(() => {
    console.log('QRCard received QR:', qr)
    console.log('QRCard mapped fields:', {
      id: qrId,
      title: qrTitle,
      status: qrStatus,
      contentType: qrContentType,
      isActive: qr?.isActive
    })
  }, [qr])

  const handleCopyUrl = async () => {
    if (!qrId) {
      console.error('QRCard: No QR ID for copy URL')
      showError('QR ID topilmadi')
      return
    }

    // Backend dan kelgan scanUrl yoki service dan generate qilish
    const url = qrScanUrl || qrService.getScanUrl(qrId)
    console.log('QRCard: Copying URL:', url)
    
    const success = await copyToClipboard(url)
    if (success) {
      showSuccess('URL nusxalandi')
    } else {
      showError('URL nusxalashda xatolik')
    }
  }

  const handlePreview = () => {
    if (!qrId) {
      console.error('QRCard: No QR ID for preview')
      showError('QR ID topilmadi')
      return
    }

    const previewUrl = qrService.getPreviewUrl(qrId)
    console.log('QRCard: Opening preview:', previewUrl)
    window.open(previewUrl, '_blank')
  }

  const handleEdit = () => {
    console.log('QRCard: Edit button clicked for QR:', qr)
    
    if (!qr) {
      console.error('QRCard: No QR object to edit')
      showError('QR ma\'lumotlari topilmadi')
      return
    }
    
    if (!qrId) {
      console.error('QRCard: QR object missing ID:', qr)
      showError('QR kod ID topilmadi')
      return
    }
    
    // Backend formatdan frontend formatga konvertatsiya
    const normalizedQR = {
      _id: qrId,
      id: qrId,
      title: qrTitle,
      description: qrDescription,
      status: qrStatus,
      contentType: qrContentType,
      createdAt: qrCreatedAt,
      updatedAt: qr?.updatedAt || qr?.lastModified,
      scanCount: qrScanCount,
      isActive: qr?.isActive,
      
      // Backend currentContent ni root levelga flatten qilish
      ...qr?.currentContent,
      
      // Backend URLs
      scanUrl: qrScanUrl,
      qrImageUrl: qrImageUrl,
      
      // Backend currentContent ni saqlab qolish (QRContentEditor uchun)
      currentContent: qr?.currentContent
    }
    
    console.log('QRCard: Normalized QR for edit:', normalizedQR)
    
    if (typeof onEdit === 'function') {
      onEdit(normalizedQR)
    } else {
      console.error('QRCard: onEdit is not a function')
      showError('Edit funksiyasi topilmadi')
    }
  }

  const handleDelete = () => {
    console.log('QRCard: Delete requested for QR:', qrId)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (!qrId) {
      console.error('QRCard: No QR ID for delete')
      showError('QR ID topilmadi')
      return
    }

    console.log('QRCard: Confirming delete for QR:', qrId)
    
    if (typeof onDelete === 'function') {
      onDelete(qrId)
    } else {
      console.error('QRCard: onDelete is not a function')
      showError('Delete funksiyasi topilmadi')
    }
    setShowDeleteConfirm(false)
  }

  const handleRestore = () => {
    console.log('QRCard: Restore requested for QR:', qrId)
    setShowRestoreConfirm(true)
  }

  const handleRestoreConfirm = () => {
    if (!qrId) {
      console.error('QRCard: No QR ID for restore')
      showError('QR ID topilmadi')
      return
    }

    console.log('QRCard: Confirming restore for QR:', qrId)
    
    if (typeof onRestore === 'function') {
      onRestore(qrId)
    } else {
      console.error('QRCard: onRestore is not a function')
      showError('Restore funksiyasi topilmadi')
    }
    setShowRestoreConfirm(false)
  }

  const getStatusBadge = () => {
    if (qrStatus === 'active' || qr?.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ● Faol
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ● O'chirilgan
        </span>
      )
    }
  }

  const getContentTypeBadge = () => {
    if (!qrContentType || qrContentType === 'empty') return null
    
    const labels = {
      // text: 'Matn',
      link: 'Havola', 
      file: 'Fayl',
      // contact: 'Kontakt',
      empty: 'Bo\'sh'
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {getContentTypeIcon(qrContentType)} {labels[qrContentType] || qrContentType}
      </span>
    )
  }

  // QR obyekti mavjud emasligini tekshirish
  if (!qr) {
    console.error('QRCard: No QR object provided')
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
        <p className="text-red-600 text-center">QR ma'lumotlari topilmadi</p>
      </div>
    )
  }

  // Fallback image uchun data URL
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA3MkM2MC4yNTQ0IDcyIDcwIDYyLjI1NDQgNzAgNTBDNzAgMzcuNzQ1NiA2MC4yNTQ0IDI4IDQ4IDI4QzM1Ljc0NTYgMjggMjYgMzcuNzQ1NiAyNiA1MEMyNiA2Mi4yNTQ0IDM1Ljc0NTYgNzIgNDggNzJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik00OCA1OEM1MS4zMTM3IDU4IDU0IDU1LjMxMzcgNTQgNTJDNTQgNDguNjg2MyA1MS4zMTM3IDQ2IDQ4IDQ2QzQ0LjY4NjMgNDYgNDIgNDguNjg2MyA0MiA1MkM0MiA1NS4zMTM3IDQ0LjY4NjMgNTggNDggNThaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* QR Code Image */}
        {/* <div className="p-4 bg-gray-50 flex justify-center">
          {qrId ? (
            <img
              src={qrImageUrl || qrService.getQRImageUrl(qrId)}
              alt={`QR Code for ${qrTitle || 'Unknown QR'}`}
              className="w-24 h-24 object-contain"
              onError={(e) => {
                console.error('QR image load error for ID:', qrId)
                e.target.src = fallbackImage
              }}
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div> */}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate flex-1" title={qrTitle}>
              {qrTitle || 'Noma\'lum QR'}
            </h3>
            {getStatusBadge()}
          </div>

          {/* {qrDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={qrDescription}>
              {qrDescription}
            </p>
          )} */}

          {/* Content preview */}
          {qrContentType && qrContentType !== 'empty' && qr?.currentContent && (
            <div className="text-sm text-gray-600 mb-3">
              {/* {qrContentType === 'text' && qr.currentContent.text && (
                <p className="line-clamp-2">{qr.currentContent.text}</p>
              )} */}
              {/* {qrContentType === 'link' && qr.currentContent.url && (
                <p className="line-clamp-1 break-all">{qr.currentContent.linkTitle || qr.currentContent.url}</p>
              )}
              {qrContentType === 'file' && qr.currentContent.originalName && (
                <p className="line-clamp-1">{qr.currentContent.originalName}</p>
              )} */}
              {/* {qrContentType === 'contact' && qr.currentContent.contactName && (
                <p className="line-clamp-1">{qr.currentContent.contactName}</p>
              )} */}
            </div>
          )}

          {/* Badges */}
            {/* <div className="flex flex-wrap gap-2 mb-3">
              {getContentTypeBadge()}
            </div> */}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{qrScanCount} scan</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{qrCreatedAt ? formatDate(qrCreatedAt) : 'Noma\'lum'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <div className="flex space-x-2">
              <button
                onClick={handlePreview}
                disabled={!qrId}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Ko'rish"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={handleCopyUrl}
                disabled={!qrId}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="URL nusxalash"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="flex space-x-2">
              {(qrStatus === 'active' || qr?.isActive) ? (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={!qrId}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Tahrirlash"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={!qrId}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="O'chirish"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRestore}
                  disabled={!qrId}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Tiklash"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="QR kodni o'chirish"
        message={`"${qrTitle}" QR kodini o'chirishni xohlaysizmi? Bu amalni bekor qilish mumkin.`}
        confirmText="O'chirish"
        variant="danger"
      />

      {/* Restore Confirmation */}
      <ConfirmDialog
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreConfirm}
        title="QR kodni tiklash"
        message={`"${qrTitle}" QR kodini tiklashni xohlaysizmi?`}
        confirmText="Tiklash"
        variant="success"
      />
    </>
  )
}

export default QRCard