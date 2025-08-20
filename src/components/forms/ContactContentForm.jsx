// components/forms/ContactContentForm.jsx
import React, { useState, useEffect } from 'react'
import { User, Save, Phone, Mail, Building, Globe } from 'lucide-react'
import { validateEmail, validatePhone } from '../../utils/validation'
import { validateUrl } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const ContactContentForm = ({ qr, onUpdate }) => {
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    email: '',
    company: '',
    website: '',
    address: '',
    note: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (qr && qr.contentType === 'contact') {
      setFormData({
        contactName: qr.contactName || '',
        phone: qr.phone || '',
        email: qr.email || '',
        company: qr.company || '',
        website: qr.website || '',
        address: qr.address || '',
        note: qr.note || '',
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
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Ism majburiy'
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Noto\'g\'ri telefon format'
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Noto\'g\'ri email format'
    }

    if (formData.website && formData.website.trim()) {
      // Normalize website URL
      let websiteUrl = formData.website.trim()
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl
      }
      
      if (!validateUrl(websiteUrl)) {
        newErrors.website = 'Noto\'g\'ri website format'
      }
    }

    // Length validations
    const lengthLimits = {
      contactName: 100,
      company: 100,
      address: 200,
      note: 300,
      description: 500
    }

    Object.keys(lengthLimits).forEach(field => {
      if (formData[field].length > lengthLimits[field]) {
        newErrors[field] = `${lengthLimits[field]} belgidan oshmasligi kerak`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // Normalize website URL
      let normalizedWebsite = formData.website.trim()
      if (normalizedWebsite && !normalizedWebsite.startsWith('http://') && !normalizedWebsite.startsWith('https://')) {
        normalizedWebsite = 'https://' + normalizedWebsite
      }
      
      const contentData = {
        contentType: 'contact',
        contactName: formData.contactName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        website: normalizedWebsite,
        address: formData.address.trim(),
        note: formData.note.trim(),
        description: formData.description.trim()
      }
      
      console.log('Sending contact data:', contentData)
      
      await onUpdate(contentData)
    } catch (error) {
      console.error('Contact content update error:', error)
      
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <User className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kontakt Content</h3>
          <p className="text-sm text-gray-600">
            QR kod skan qilinganda kontakt ma'lumotlari ko'rsatiladi (vCard format)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Name */}
          <div className="md:col-span-2">
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
              To'liq Ism *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className={`input-field ${errors.contactName ? 'input-error' : ''}`}
              placeholder="Ism Familiya"
              maxLength={100}
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'input-error' : ''}`}
              placeholder="+998 90 123 45 67"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Kompaniya
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`input-field ${errors.company ? 'input-error' : ''}`}
              placeholder="Kompaniya nomi"
              maxLength={100}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`input-field ${errors.website ? 'input-error' : ''}`}
              placeholder="example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              https:// avtomatik qo'shiladi
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Manzil
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className={`input-field ${errors.address ? 'input-error' : ''}`}
            placeholder="To'liq manzil"
            maxLength={200}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.address.length}/200 belgi
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Qo'shimcha Eslatma
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className={`input-field ${errors.note ? 'input-error' : ''}`}
            placeholder="Lavozim, bo'lim yoki boshqa ma'lumot"
            maxLength={300}
          />
          {errors.note && (
            <p className="mt-1 text-sm text-red-600">{errors.note}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.note.length}/300 belgi
          </div>
        </div>

        {/* Description */}
        <div>
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
            placeholder="Kontakt haqida qo'shimcha ma'lumot (ixtiyoriy)"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 belgi
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">vCard haqida:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Foydalanuvchilar kontaktni telefoniga saqlashlari mumkin</li>
            <li>• vCard format barcha smartfonlarda qo'llab-quvvatlanadi</li>
            <li>• Telefon, email va website avtomatik havola bo'ladi</li>
            <li>• QR kod skan qilinganda kontakt ma'lumotlari ko'rsatiladi</li>
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
              <span>Kontakt Saqlash</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactContentForm