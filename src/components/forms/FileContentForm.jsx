// components/forms/FileContentForm.jsx
import React, { useState, useEffect } from 'react'
import { Upload, Save, File, X, Eye } from 'lucide-react'
import { formatFileSize, getFileIcon } from '../../utils/helpers'
import { validateFileSize, validateFileType } from '../../utils/validation'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../utils/constants'
import LoadingSpinner from '../common/LoadingSpinner'

const FileContentForm = ({ qr, onUpdate }) => {
  const [formData, setFormData] = useState({
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (qr && qr.contentType === 'file') {
      setFormData({
        description: qr.description || ''
      })
    }
  }, [qr])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileSelect = (file) => {
    const newErrors = {}
    
    if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
      newErrors.file = 'Fayl turi qo\'llab-quvvatlanmaydi'
    } else if (!validateFileSize(file, MAX_FILE_SIZE)) {
      newErrors.file = `Fayl hajmi ${formatFileSize(MAX_FILE_SIZE)} dan oshmasligi kerak`
    }
    
    if (Object.keys(newErrors).length === 0) {
      setSelectedFile(file)
      setErrors({})
    } else {
      setErrors(newErrors)
      setSelectedFile(null)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!selectedFile && (!qr || !qr.fileName)) {
      newErrors.file = 'Fayl majburiy'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Tavsif 500 belgidan oshmasligi kerak'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('contentType', 'file')
      formDataToSend.append('description', formData.description.trim())
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile)
      }
      
      console.log('Sending file data:', {
        contentType: 'file',
        description: formData.description.trim(),
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        fileType: selectedFile?.type
      })
      
      await onUpdate(formDataToSend)
    } catch (error) {
      console.error('File content update error:', error)
      
      // Error handling
      if (error.response) {
        console.error('Backend response:', error.response.data)
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Server xatolik: ${error.response.status}`
        alert(`Xatolik: ${errorMessage}`)
      } else if (error.request) {
        console.error('Network error:', error.request)
        alert('Tarmoq xatoligi: Server bilan bog\'lanish mumkin emas')
      } else {
        console.error('Error:', error.message)
        alert(`Xatolik: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const currentFile = qr?.fileName ? {
    name: qr.fileName,
    size: qr.fileSize || 0,
    type: qr.fileType || 'application/octet-stream'
  } : null

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Upload className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Fayl Content</h3>
          <p className="text-sm text-gray-600">
            PDF, rasm, video yoki boshqa faylni yuklang
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current File Display */}
        {currentFile && !selectedFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Joriy Fayl:</h4>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getFileIcon(currentFile.type)}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900 truncate">
                  {currentFile.name}
                </p>
                <p className="text-sm text-green-700">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
              {qr.fileUrl && (
                <button
                  type="button"
                  onClick={() => window.open(qr.fileUrl, '_blank')}
                  className="p-2 text-green-600 hover:text-green-800 transition-colors"
                  title="Faylni ko'rish"
                >
                  <Eye size={16} />
                </button>
              )}
            </div>
            <p className="text-xs text-green-700 mt-2">
              Yangi fayl yuklash uchun quyidagi maydonni ishlating
            </p>
          </div>
        )}

        {/* File Upload Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fayl {(!currentFile || selectedFile) ? '*' : '(ixtiyoriy)'}
          </label>
          
          <div
            className={`
              file-upload-zone
              ${dragActive ? 'dragover' : ''}
              ${errors.file ? 'border-red-500 bg-red-50' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              id="file-input"
              onChange={handleFileInputChange}
              accept={ALLOWED_FILE_TYPES.join(',')}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getFileIcon(selectedFile.type)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Faylni bu yerga sudrab oling
                  </p>
                  <p className="text-gray-600">yoki</p>
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <File className="w-4 h-4 mr-2" />
                    Fayl tanlash
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {errors.file && (
            <p className="mt-1 text-sm text-red-600">{errors.file}</p>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            <p>Maksimal hajm: {formatFileSize(MAX_FILE_SIZE)}</p>
            <p>Qo'llab-quvvatlanadigan formatlar: PDF, DOC, XLS, PPT, JPG, PNG, MP4, MP3 va boshqalar</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Fayl Tavsifi
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`input-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Fayl haqida qo'shimcha ma'lumot (ixtiyoriy)"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 belgi
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">Eslatma:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Fayllar xavfsiz serverda saqlanadi</li>
            <li>• Foydalanuvchilar faylni to'g'ridan-to'g'ri yuklab olishlari mumkin</li>
            <li>• Katta fayllar yuklash bir necha daqiqa vaqt olishi mumkin</li>
            <li>• Fayl nomi va hajmi foydalanuvchiga ko'rsatiladi</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Yuklanmoqda...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Fayl Saqlash</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FileContentForm