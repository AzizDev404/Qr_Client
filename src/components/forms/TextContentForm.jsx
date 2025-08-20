// components/forms/TextContentForm.jsx
import React, { useState, useEffect } from 'react'
import { FileText, Save } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const TextContentForm = ({ qr, onUpdate }) => {
  const [formData, setFormData] = useState({
    text: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (qr && qr.contentType === 'text') {
      setFormData({
        text: qr.text || '',
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.text.trim()) {
      newErrors.text = 'Matn majburiy'
    }
    
    if (formData.text.length > 5000) {
      newErrors.text = 'Matn 5000 belgidan oshmasligi kerak'
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
      const contentData = {
        contentType: 'text',
        text: formData.text.trim(),
        description: formData.description.trim()
      }
      
      await onUpdate(contentData)
    } catch (error) {
      console.error('Text content update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <FileText className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Matn Content</h3>
          <p className="text-sm text-gray-600">
            QR kod skan qilinganda ko'rsatiladigan matn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Matn *
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={6}
            className={`input-field ${errors.text ? 'input-error' : ''}`}
            placeholder="QR kod orqali ko'rsatiladigan matningizni kiriting..."
            maxLength={5000}
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600">{errors.text}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.text.length}/5000 belgi
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Qo'shimcha Tavsif
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`input-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Matn haqida qo'shimcha ma'lumot (ixtiyoriy)"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 belgi
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Eslatma:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Matn formatlash (bold, italic) qo'llab-quvvatlanadi</li>
            <li>• Emoji va unicode belgilar ishlatishingiz mumkin</li>
            <li>• Link qo'shish uchun "Havola" turini tanlang</li>
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
              <span>Saqlanmoqda...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Matn Saqlash</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default TextContentForm