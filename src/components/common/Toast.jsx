// components/common/Toast.jsx
import React from 'react'
import { useToast } from '../../context/ToastContext'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const Toast = () => {
  const { toasts, removeToast } = useToast()

  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-600" />
      case 'error': return <XCircle size={20} className="text-red-600" />
      case 'warning': return <AlertTriangle size={20} className="text-yellow-600" />
      default: return <Info size={20} className="text-blue-600" />
    }
  }

  const getToastClasses = (type) => {
    const base = 'border-l-4'
    switch (type) {
      case 'success': return `${base} border-green-500 bg-green-50`
      case 'error': return `${base} border-red-500 bg-red-50`
      case 'warning': return `${base} border-yellow-500 bg-yellow-50`
      default: return `${base} border-blue-500 bg-blue-50`
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center p-4 rounded-lg shadow-lg min-w-80 max-w-md
            ${getToastClasses(toast.type)} toast-enter-active
          `}
        >
          <div className="flex-shrink-0">
            {getToastIcon(toast.type)}
          </div>
          
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {toast.message}
            </p>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
