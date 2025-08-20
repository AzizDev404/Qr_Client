// components/qr/QRContentEditor.jsx - Backend formatiga moslashtirilgan va empty content type fix
import React, { useState, useEffect } from 'react'
import { CONTENT_TYPES, CONTENT_TYPE_LABELS } from '../../utils/constants'
import TextContentForm from '../forms/TextContentForm'
import LinkContentForm from '../forms/LinkContentForm'
import FileContentForm from '../forms/FileContentForm'
import ContactContentForm from '../forms/ContactContentForm'
import { FileText, Link, Upload, User, AlertCircle, CheckCircle, Inbox } from 'lucide-react'

const QRContentEditor = ({ qr, onUpdate }) => {
  // Backend currentContent.type ni olish - empty va noma'lum typelarni handle qilish
  const [selectedType, setSelectedType] = useState(() => {
    // Backend response structure: {success: true, qr: {...}}
    const actualQR = qr?.qr || qr  // Handle both wrapped and direct qr object
    const backendType = actualQR?.currentContent?.type
    
    // Agar backend 'empty' yoki noma'lum type yuborsa, TEXT ga default qilish
    if (!backendType || backendType === 'empty' || !Object.values(CONTENT_TYPES).includes(backendType)) {
      return CONTENT_TYPES.TEXT
    }
    return backendType
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // QR content type ni defensive tarzda handle qilish
  useEffect(() => {
    console.log('QRContentEditor received QR:', qr)
    
    // Backend response structure handle qilish
    const actualQR = qr?.qr || qr  // Handle both wrapped and direct qr object
    const backendType = actualQR?.currentContent?.type
    
    console.log('Actual QR object:', actualQR)
    console.log('Backend content type:', backendType)
    
    // Empty yoki noma'lum content typelarni handle qilish
    if (!backendType || backendType === 'empty' || !Object.values(CONTENT_TYPES).includes(backendType)) {
      console.log('Backend content type is empty/invalid, defaulting to TEXT:', backendType)
      // Har doim TEXT ga set qilish, chunki empty case bor
      if (selectedType !== CONTENT_TYPES.TEXT) {
        setSelectedType(CONTENT_TYPES.TEXT)
      }
      return
    }
    
    // Faqat farqli bo'lsa update qilish
    if (backendType !== selectedType) {
      console.log('Updating selectedType from QR currentContent:', backendType)
      setSelectedType(backendType)
    }
  }, [qr, selectedType])

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
      console.log('QRContentEditor: Updating content:', {
        type: selectedType,
        data: contentData
      })
      
      // Backend format - contentType va content data alohida
      const updateData = {
        contentType: selectedType,
        ...contentData
      }
      
      await onUpdate(updateData)
      
      console.log('QRContentEditor: Content update successful')
      setSuccess('Content muvaffaqiyatli yangilandi!')
      
      // Success message ni 3 soniyadan keyin olib tashlash
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error) {
      console.error('QRContentEditor: Content update failed:', error)
      setError(error.message || 'Content yangilashda xatolik')
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

  // QR contentining empty yoki mavjud emasligini tekshirish
  const isContentEmpty = () => {
    // Backend response structure handle qilish
    const actualQR = qr?.qr || qr
    const currentContent = actualQR?.currentContent
    
    return !currentContent || 
           !currentContent.type || 
           currentContent.type === 'empty' ||
           !Object.values(CONTENT_TYPES).includes(currentContent.type)
  }

  // Empty content uchun component
  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        QR kod hali bo'sh
      </h3>
      <p className="text-gray-600 mb-4">
        Yuqoridagi content turlaridan birini tanlab, ma'lumot qo'shing
      </p>
      <p className="text-sm text-gray-500">
        Foydalanuvchilar QR kodni scan qilganda bu content ko'rinadi
      </p>
    </div>
  )

  // Content formani render qilish
  const renderContentForm = () => {
    // Backend response structure handle qilish
    const actualQR = qr?.qr || qr
    const currentContent = actualQR?.currentContent || {}
    
    const normalizedQR = {
      ...actualQR,
      // Backend currentContent ichidagi fieldlarni root levelga ko'chirish
      contentType: currentContent.type,
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

    // Empty yoki noma'lum content type bo'lsa, empty state ko'rsatish
    if (isContentEmpty() || selectedType === 'empty' || !Object.values(CONTENT_TYPES).includes(selectedType)) {
      return renderEmptyState()
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
        // Bu yerga hech qachon kelmaydi, lekin safety uchun
        console.warn('QRContentEditor: Fallback to empty state for type:', selectedType)
        return renderEmptyState()
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

  // Backend response structure handle qilish
  const actualQR = qr?.qr || qr
  
  // QR ID mavjud emasligini tekshirish
  if (!actualQR || (!actualQR.id && !actualQR._id)) {
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
      {/* Debug Info - Production da olib tashlash */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> QR ID: {actualQR.id || actualQR._id}, 
          Selected Type: {selectedType}, 
          Backend Type: {actualQR?.currentContent?.type || 'undefined'},
          Is Empty: {isContentEmpty().toString()},
          Valid Types: {Object.values(CONTENT_TYPES).join(', ')},
          Response Structure: {qr?.success ? 'Wrapped' : 'Direct'}
        </div>
      )}

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

      {/* Current Content Info - faqat valid content mavjud bo'lsa ko'rsatish */}
      {!isContentEmpty() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Joriy Content</h4>
          <div className="text-sm text-blue-800">
            <p><strong>Tur:</strong> {CONTENT_TYPE_LABELS[actualQR.currentContent.type] || actualQR.currentContent.type}</p>
            
            {actualQR.currentContent.type === 'text' && actualQR.currentContent.text && (
              <p><strong>Matn:</strong> {actualQR.currentContent.text.length > 100 
                ? actualQR.currentContent.text.substring(0, 100) + '...' 
                : actualQR.currentContent.text}</p>
            )}
            
            {actualQR.currentContent.type === 'link' && actualQR.currentContent.url && (
              <p><strong>URL:</strong> <span className="break-all">{actualQR.currentContent.url}</span></p>
            )}
            
            {actualQR.currentContent.type === 'file' && actualQR.currentContent.originalName && (
              <p><strong>Fayl:</strong> {actualQR.currentContent.originalName} 
                {actualQR.currentContent.fileSize && ` (${Math.round(actualQR.currentContent.fileSize / 1024)} KB)`}</p>
            )}
            
            {actualQR.currentContent.type === 'contact' && actualQR.currentContent.contactName && (
              <p><strong>Kontakt:</strong> {actualQR.currentContent.contactName} 
                {actualQR.currentContent.phone && ` (${actualQR.currentContent.phone})`}</p>
            )}
            
            {actualQR.currentContent.description && (
              <p><strong>Tavsif:</strong> {actualQR.currentContent.description}</p>
            )}
            
            {actualQR.currentContent.lastUpdated && (
              <p><strong>Yangilandi:</strong> {new Date(actualQR.currentContent.lastUpdated).toLocaleString('uz-UZ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Content Type Selector */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Content Turini Tanlang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentTypeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedType === option.type
            const isCurrent = !isContentEmpty() && actualQR?.currentContent?.type === option.type
                        
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

      {/* Content Form yoki Empty State */}
      <div className="border-t border-gray-200 pt-6">
        {renderContentForm()}
      </div>
    </div>
  )
}

export default QRContentEditor