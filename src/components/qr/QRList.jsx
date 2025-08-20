// components/qr/QRList.jsx
import React, { useState, useEffect } from 'react'
import { qrService } from '../../services/qrService'
import { useToast } from '../../context/ToastContext'
import QRCard from './QRCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { Search, Plus, Filter } from 'lucide-react'

const QRList = ({ onCreateNew, onEdit }) => {
  const [qrs, setQRs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const { error: showError, success: showSuccess } = useToast()

  useEffect(() => {
    loadQRs()
  }, [pagination.page, searchTerm, filter])

  const loadQRs = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: filter !== 'all' ? filter : undefined
      }

      const response = await qrService.getQRs(params)
      setQRs(response.qrs || [])
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }))
    } catch (error) {
      showError('QR kodlarni yuklashda xatolik')
      console.error('Load QRs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (qrId) => {
    try {
      await qrService.deleteQR(qrId)
      showSuccess('QR kod o\'chirildi')
      loadQRs()
    } catch (error) {
      showError('QR kod o\'chirishda xatolik')
    }
  }

  const handleRestore = async (qrId) => {
    try {
      await qrService.restoreQR(qrId)
      showSuccess('QR kod tiklandi')
      loadQRs()
    } catch (error) {
      showError('QR kod tiklashda xatolik')
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const filteredQRs = qrs.filter(qr => {
    const matchesSearch = qr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || qr.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Kodlar</h2>
          {/* <p className="text-gray-600">Jami {pagination.total} ta QR kod</p> */}
        </div>
        
        <button
          onClick={onCreateNew}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Yangi QR</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="QR kod qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Barchasi</option>
            <option value="active">Faol</option>
            <option value="deleted">O'chirilgan</option>
          </select>
        </div>
      </div>

      {/* QR Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredQRs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            QR kod topilmadi
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Qidiruv natijasi bo\'yicha' : 'Hozircha'} QR kodlar yo'q
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQRs.map(qr => (
              <QRCard
                key={qr._id}
                qr={qr}
                onEdit={onEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Oldingi
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Keyingi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default QRList