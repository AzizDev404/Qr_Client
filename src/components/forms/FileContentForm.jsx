// components/forms/FileContentForm.jsx
import React, { useState } from 'react'
import { Upload, File, AlertCircle, CheckCircle, X } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const FileContentForm = ({ qr, onUpdate, isLoading, contentType }) => {
  const [formData, setFormData] = useState({
    file: null,
    description: qr?.description || ''
  })
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.txt', '.doc', '.docx']

  const handleFileSelect = (file) => {
    if (!file) return
    setError(null) // eski errorni reset qilamiz

    // File size check (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Fayl hajmi 10MB dan kichik bo\'lishi kerak')
      return
    }

    // File type & extension check
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      setError('Qo\'llab-quvvatlanmaydigan fayl turi. PDF, rasm, video yoki dokument yuklang')
      return
    }

    setFormData(prev => ({ ...prev, file }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0])
  }

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.file && !qr?.filePath && !qr?.fileName && !qr?.originalName) {
      setError('Fayl yuklash majburiy! Avval fayl tanlang.')
      return
    }

    try {
      let updateData

      if (formData.file) {
        updateData = new FormData()
        updateData.append('contentType', 'file')
        updateData.append('file', formData.file)
        if (formData.description.trim()) {
          updateData.append('description', formData.description.trim())
        }
      } else {
        updateData = {
          contentType: 'file',
          description: formData.description.trim(),
          fileName: qr.fileName || qr.originalName,
          filePath: qr.filePath,
          fileSize: qr.fileSize,
          mimeType: qr.mimeType
        }
      }

      await onUpdate(updateData)
    } catch (error) {
      setError(error.message || 'Fayl yuklashda xatolik')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fayl yuklash *
        </label>

        {/* Current File */}
        {qr?.filePath && !formData.file && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{qr.fileName || qr.originalName}</p>
                {qr.fileSize && <p className="text-sm text-blue-600">{formatFileSize(qr.fileSize)}</p>}
                <p className="text-xs text-blue-500">Joriy fayl - yangi fayl yuklasangiz almashadi</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            aria-label="Fayl yuklash"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={allowedExtensions.join(',')}
          />
          
          {formData.file ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <File className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{formData.file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(formData.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Fayl tayyor</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${dragActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {dragActive ? 'Faylni bu yerga tashlang' : 'Fayl yuklash uchun bosing yoki sudrab tashlang'}
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF, rasm, video yoki dokument (max 10MB)</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {/* <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Tavsif (ixtiyoriy)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Fayl haqida qo'shimcha ma'lumot..."
        />
      </div> */}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || (!formData.file && !qr?.filePath && !qr?.fileName && !qr?.originalName)}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>
                {formData.file 
                  ? 'Yangi Fayl Yuklash' 
                  : qr?.filePath || qr?.fileName || qr?.originalName 
                    ? 'Ma\'lumotni Saqlash' 
                    : 'Fayl Tanlang'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Validation Message */}
      {!formData.file && !qr?.filePath && !qr?.fileName && !qr?.originalName && (
        <div className="text-center text-red-600 text-sm">
          ⚠️ Avval fayl yuklang yoki mavjud faylni tanlang
        </div>
      )}

  
    </form>
  )
}

export default FileContentForm
