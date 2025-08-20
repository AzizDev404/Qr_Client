// components/common/ConfirmDialog.jsx
import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Tasdiqlash', 
  message = 'Ushbu amalni bajarishni xohlaysizmi?',
  confirmText = 'Ha',
  cancelText = 'Yo\'q',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getButtonClasses = () => {
    switch (variant) {
      case 'danger': return 'btn-danger'
      case 'warning': return 'bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors'
      default: return 'btn-primary'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>
        
        <div className="flex space-x-3 justify-center">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={getButtonClasses()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog