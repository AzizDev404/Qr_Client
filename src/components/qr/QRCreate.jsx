// components/qr/QRCreate.jsx
import React, { useState } from 'react'
import Modal from '../common/Modal'
import { qrService } from '../../services/qrService'
import { useToast } from '../../context/ToastContext'
import { QrCode } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

const QRCreate = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { success: showSuccess, error: showError } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Sarlavha majburiy'
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Sarlavha 100 belgidan oshmasligi kerak'
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
      const response = await qrService.createQR(formData)
      showSuccess('QR kod muvaffaqiyatli yaratildi')
      onSuccess(response)
      handleClose()
    } catch (error) {
      showError(error.response?.data?.message || 'QR kod yaratishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ title: '', description: '' })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Yangi QR Kod Yaratish"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            QR kod yaratilgach, unga turli xil content qo'sha olasiz
          </p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Sarlavha *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input-field ${errors.title ? 'input-error' : ''}`}
            placeholder="QR kod sarlavhasini kiriting"
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 belgi
          </div>
        </div>

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
            placeholder="QR kod haqida qo'shimcha ma'lumot (ixtiyoriy)"
            maxLength={500}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 belgi
          </div>
        </div>

        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Keyingi qadamlar:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• QR kod yaratiladi</li>
            <li>• Content qo'shish uchun "Tahrirlash" tugmasini bosing</li>
            <li>• Matn, havola, fayl yoki kontakt ma'lumotlarini qo'shing</li>
            <li>• QR kod har doim bir xil, lekin content o'zgaradi</li>
          </ul>
        </div> */}

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Yaratilmoqda...
              </div>
            ) : (
              'QR Kod Yaratish'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default QRCreate