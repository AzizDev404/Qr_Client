// components/forms/LinkContentForm.jsx
import React, { useState, useEffect } from 'react'
import { Link as LinkIcon, Save, ExternalLink } from 'lucide-react'
import { validateUrl } from '../../utils/helpers' // helpers.js dan import qilish
import LoadingSpinner from '../common/LoadingSpinner'

const LinkContentForm = ({ qr, onUpdate }) => {
  const [formData, setFormData] = useState({
    url: '',
    linkTitle: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (qr && qr.contentType === 'link') {
      setFormData({
        url: qr.url || '',
        linkTitle: qr.linkTitle || '',
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

  const normalizeUrl = (url) => {
    if (!url) return ''
    
    // Email uchun
    if (url.includes('@') && !url.startsWith('mailto:')) {
      return 'mailto:' + url
    }
    
    // Telefon uchun  
    if (url.startsWith('+') || /^\d+$/.test(url.replace(/[\s\-\(\)]/g, ''))) {
      return 'tel:' + url.replace(/[\s\-\(\)]/g, '')
    }
    
    // Website uchun
    if (!url.startsWith('http://') && !url.startsWith('https://') && 
        !url.startsWith('mailto:') && !url.startsWith('tel:')) {
      return 'https://' + url
    }
    
    return url
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL majburiy'
    } else {
      const normalizedUrl = normalizeUrl(formData.url.trim())
      if (!validateUrl(normalizedUrl)) {
        newErrors.url = 'Noto\'g\'ri URL format'
      }
    }
    
    if (formData.linkTitle.length > 200) {
      newErrors.linkTitle = 'Sarlavha 200 belgidan oshmasligi kerak'
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
      // URL ni normalize qilish
      const normalizedUrl = normalizeUrl(formData.url.trim())
      
      const contentData = {
        contentType: 'link',
        url: normalizedUrl,
        linkTitle: formData.linkTitle.trim(),
        description: formData.description.trim()
      }
      
      console.log('Sending link data:', contentData)
      
      await onUpdate(contentData)
    } catch (error) {
      console.error('Link content update error:', error)
      
      // Batafsil error ma'lumotini ko'rsatish
      if (error.response) {
        console.error('Backend response:', error.response.data)
        console.error('Status:', error.response.status)
        
        // User-friendly error message
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

  const handleTestUrl = () => {
    if (formData.url) {
      const testUrl = normalizeUrl(formData.url.trim())
      if (validateUrl(testUrl)) {
        window.open(testUrl, '_blank')
      } else {
        alert('URL formatini to\'g\'rilang')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <LinkIcon className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Havola Content</h3>
          <p className="text-sm text-gray-600">
            QR kod skan qilinganda foydalanuvchini belgilangan havolaga yo'naltiradi
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            URL Manzil *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`flex-1 input-field ${errors.url ? 'input-error' : ''}`}
              placeholder="https://example.com"
            />
            <button
              type="button"
              onClick={handleTestUrl}
              disabled={!formData.url}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Havolani test qilish"
            >
              <ExternalLink size={16} />
            </button>
          </div>
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            URL avtomatik https:// bilan to'ldiriladi
          </div>
        </div>

        {/* <div>
          <label htmlFor="linkTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Havola Sarlavhasi
          </label>
          <input
            type="text"
            id="linkTitle"
            name="linkTitle"
            value={formData.linkTitle}
            onChange={handleChange}
            className={`input-field ${errors.linkTitle ? 'input-error' : ''}`}
            placeholder="Havola sarlavhasi (ixtiyoriy)"
            maxLength={200}
          />
          {errors.linkTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.linkTitle}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.linkTitle.length}/200 belgi
          </div>
        </div> */}

        {/* <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Tavsif
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`input-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Havola haqida qo'shimcha ma'lumot (ixtiyoriy)"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 belgi
          </div>
        </div> */}

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Mashhur formatlar:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>• Website: example.com</div>
            <div>• YouTube: youtube.com/watch?v=...</div>
            <div>• Instagram: instagram.com/username</div>
            <div>• Telegram: t.me/username</div>
            <div>• WhatsApp: wa.me/998901234567</div>
            <div>• Email: user@example.com</div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            * https:// avtomatik qo'shiladi
          </p>
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
              <span>Havola Saqlash</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default LinkContentForm