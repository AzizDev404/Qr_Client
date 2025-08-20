// components/qr/QRContentEditor.jsx - Backend formatiga mos
import React, { useState, useEffect } from 'react'
import { CONTENT_TYPES, CONTENT_TYPE_LABELS } from '../../utils/constants'
import TextContentForm from '../forms/TextContentForm'
import LinkContentForm from '../forms/LinkContentForm'
import FileContentForm from '../forms/FileContentForm'
import ContactContentForm from '../forms/ContactContentForm'
import { FileText, Link, Upload, User, AlertCircle, CheckCircle } from 'lucide-react'

const QRContentEditor = ({ qr, onUpdate }) => {
  // Backend currentContent.type ni olish
  const [selectedType, setSelectedType] = useState(
    qr?.currentContent?.type || CONTENT_TYPES.TEXT
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Debug: QR obyektini log qilish
  useEffect(() => {
    console.log('QRContentEditor received QR:', qr)
    if (qr?.currentContent?.type && qr.currentContent.type !== selectedType) {
      console.log('Updating selectedType from QR currentContent:', qr.currentContent.type)
      setSelectedType(qr.currentContent.type)
    }
  }, [qr])

  const contentTypeOptions = [
    {
      type: CONTENT_TYPES.TEXT,
      label: CONTENT_TYPE_LABELS[CONTENT_TYPES.TEXT],
      icon: FileText,
      description: 'Matn, xabar yoki announcement'
    },
    {
      type: CONTENT_TYPES.LINK,
      label: CONTENT_TYPE_LABELS[CONTENT_TYPES.LINK],
      icon: Link,
      description: 'Website, video yoki social media havola'
    },
    {
      type: CONTENT_TYPES.FILE,
      label: CONTENT_TYPE_LABELS[CONTENT_TYPES.FILE],
      icon: Upload,
      description: 'PDF, rasm, video yoki dokument'
    },
    {
      type: CONTENT_TYPES.CONTACT,
      label: CONTENT_TYPE_LABELS[CONTENT_TYPES.CONTACT],
      icon: User,
      description: 'Kontakt ma\'lumotlari (vCard)'
    }
  ]

const handleUpdate = async (contentData) => {
  if (!onUpdate || typeof onUpdate !== 'function') {
    console.error('QRContentEditor: onUpdate callback not provided')
    setError('Update funksiyasi mavjud emas')
    return
  }

  setIsLoading(true)
  setError(null)
  setSuccess(null)

  try {
    let updatePayload

    // Agar fayl kelsa -> FormData bo‘lib yuboriladi
    if (contentData instanceof FormData) {
      updatePayload = contentData
    } else {
      updatePayload = {
        contentType: selectedType,
        ...contentData
      }
    }

    console.log('QRContentEditor: Final update payload:', updatePayload)

    await onUpdate(updatePayload)

    console.log('QRContentEditor: Content update successful')
    setSuccess('Content muvaffaqiyatli yangilandi!')

    setTimeout(() => setSuccess(null), 3000)
  } catch (error) {
    console.error('QRContentEditor: Content update failed:', error)

    let errorMessage = 'Content yangilashda xatolik'
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error?.response?.data) {
      errorMessage = `Server error: ${JSON.stringify(error.response.data)}`
    } else if (error?.message) {
      errorMessage = error.message
    }

    setError(errorMessage)
  } finally {
    setIsLoading(false)
  }
}

  const handleTypeChange = (newType) => {
    console.log('QRContentEditor: Content type changed:', newType)
    setSelectedType(newType)
    setError(null)
    setSuccess(null)
  }

  // Content formani render qilish
  const renderContentForm = () => {
    // Backend currentContent dan ma'lumotlarni frontend formatiga o'tkazish
    const currentContent = qr?.currentContent || {}
    
    const normalizedQR = {
      ...qr,
      // Backend currentContent ichidagi fieldlarni root levelga ko'chirish
      contentType: currentContent.type || selectedType,
      text: currentContent.text,
      url: currentContent.url,
      linkTitle: currentContent.linkTitle,
      fileName: currentContent.originalName, // Backend originalName ishlatadi
      originalName: currentContent.originalName,
      filePath: currentContent.filePath,
      fileSize: currentContent.fileSize,
      mimeType: currentContent.mimeType,
      contactName: currentContent.contactName,
      phone: currentContent.phone,
      email: currentContent.email,
      company: currentContent.company,
      description: currentContent.description
    }

    const commonProps = { 
      qr: normalizedQR,
      onUpdate: handleUpdate,
      isLoading,
      contentType: selectedType
    }

    switch (selectedType) {
      case CONTENT_TYPES.TEXT:
        return <TextContentForm {...commonProps} />
      case CONTENT_TYPES.LINK:
        return <LinkContentForm {...commonProps} />
      case CONTENT_TYPES.FILE:
        return <FileContentForm {...commonProps} />
      case CONTENT_TYPES.CONTACT:
        return <ContactContentForm {...commonProps} />
      default:
        console.warn('QRContentEditor: Unknown content type:', selectedType)
        return <TextContentForm {...commonProps} />
    }
  }

  // QR obyekti mavjud emasligini tekshirish
  if (!qr) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">QR ma'lumotlari topilmadi</p>
        </div>
      </div>
    )
  }

  // QR ID mavjud emasligini tekshirish
  if (!qr.id && !qr._id) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">QR kod ID topilmadi</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Current Content Info */}
      {/* {qr.currentContent && qr.currentContent.type !== 'empty' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Joriy Content</h4>
          <div className="text-sm text-blue-800">
            <p><strong>Tur:</strong> {CONTENT_TYPE_LABELS[qr.currentContent.type] || qr.currentContent.type}</p>
            
            {qr.currentContent.type === 'text' && qr.currentContent.text && (
              <p><strong>Matn:</strong> {qr.currentContent.text.length > 100 
                ? qr.currentContent.text.substring(0, 100) + '...' 
                : qr.currentContent.text}</p>
            )}
            
            {qr.currentContent.type === 'link' && qr.currentContent.url && (
              <p><strong>URL:</strong> <span className="break-all">{qr.currentContent.url}</span></p>
            )}
            
            {qr.currentContent.type === 'file' && qr.currentContent.originalName && (
              <p><strong>Fayl:</strong> {qr.currentContent.originalName} 
                {qr.currentContent.fileSize && ` (${Math.round(qr.currentContent.fileSize / 1024)} KB)`}</p>
            )}
            
            {qr.currentContent.type === 'contact' && qr.currentContent.contactName && (
              <p><strong>Kontakt:</strong> {qr.currentContent.contactName} 
                {qr.currentContent.phone && ` (${qr.currentContent.phone})`}</p>
            )}
            
            {qr.currentContent.description && (
              <p><strong>Tavsif:</strong> {qr.currentContent.description}</p>
            )}
            
            <p><strong>Yangilandi:</strong> {new Date(qr.currentContent.lastUpdated).toLocaleString('uz-UZ')}</p>
          </div>
        </div>
      )} */}

      {/* Content Type Selector */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Content Turini Tanlang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentTypeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedType === option.type
            const isCurrent = qr?.currentContent?.type === option.type
                        
            return (
              <button
                key={option.type}
                onClick={() => handleTypeChange(option.type)}
                disabled={isLoading}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all relative
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {isCurrent && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Joriy
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`
                      w-5 h-5
                      ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                    `} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`
                      font-medium
                      ${isSelected ? 'text-blue-900' : 'text-gray-900'}
                    `}>
                      {option.label}
                    </h4>
                    <p className={`
                      text-sm mt-1
                      ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                    `}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Form */}
      <div className="border-t border-gray-200 pt-6">
        {renderContentForm()}
      </div>
    </div>
  )
}

export default QRContentEditor