// components/forms/TextContentForm.jsx - Validation bilan
import React, { useState } from 'react'
import { FileText, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const TextContentForm = ({ qr, onUpdate, isLoading, contentType }) => {
  const [formData, setFormData] = useState({
    text: qr?.text || '',
    description: qr?.description || ''
  })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.text.trim()) {
      setError('Matn kiriting!')
      return
    }

    if (formData.text.trim().length > 2000) {
      setError('Matn 2000 belgidan oshmasligi kerak')
      return
    }

    try {
      const updateData = {
        contentType: 'text',
        text: formData.text.trim(),
        description: formData.description.trim()
      }

      console.log('TextContentForm: Submitting data:', updateData)
      await onUpdate(updateData)

    } catch (error) {
      console.error('TextContentForm: Submit error:', error)
      setError(error.message || 'Matn saqlashda xatolik')
    }
  }

  const handleTextChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, text: value }))
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Text Input */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
          Matn * 
          <span className="text-gray-500 font-normal">
            ({formData.text.length}/2000)
          </span>
        </label>
        <textarea
          id="text"
          value={formData.text}
          onChange={handleTextChange}
          rows={6}
          className={`
            w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          placeholder="QR kod skanlanganda ko'rsatiladigan matn..."
          required
        />
        
        {/* Character counter */}
        <div className="flex justify-between items-center mt-1">
          <div>
            {error && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
          <div className={`text-sm ${
            formData.text.length > 1800 ? 'text-red-600' : 
            formData.text.length > 1500 ? 'text-yellow-600' : 'text-gray-500'
          }`}>
            {formData.text.length > 1800 && '⚠️ '} 
            {formData.text.length}/2000
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Tavsif (ixtiyoriy)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="QR kod haqida qo'shimcha ma'lumot..."
        />
      </div>

      {/* Preview */}
      {formData.text.trim() && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Oldindan ko'rish
          </h4>
          <div className="bg-white p-3 rounded border text-sm">
            <p className="whitespace-pre-wrap break-words">{formData.text}</p>
            {formData.description.trim() && (
              <p className="text-gray-600 text-xs mt-2 italic">{formData.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !formData.text.trim()}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Saqlanmoqda...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Matn Saqlash</span>
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>Maslahat:</strong>
        <br />
        • Qisqa va aniq matn yozing
        <br />
        • Telefon raqamlari, emaillar, web saytlar avtomatik link bo'ladi
        <br />
        • Emoji va maxsus belgilar qo'llab-quvvatlanadi 📱✨
        <br />
        • Maksimal: 2000 belgi
      </div>
    </form>
  )
}

export default TextContentForm