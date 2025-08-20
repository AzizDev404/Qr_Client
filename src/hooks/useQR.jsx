// hooks/useQR.jsx
import { useState, useCallback } from 'react'
import { qrService } from '../services/qrService'
import { useToast } from './useToast'

export const useQR = () => {
  const [qrs, setQRs] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const { success: showSuccess, error: showError } = useToast()

  const loadQRs = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const response = await qrService.getQRs({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      })
      
      setQRs(response.qrs || [])
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
        ...params
      }))
      
      return response
    } catch (error) {
      showError('QR kodlarni yuklashda xatolik')
      throw error
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, showError])

  const createQR = useCallback(async (data) => {
    try {
      const response = await qrService.createQR(data)
      showSuccess('QR kod muvaffaqiyatli yaratildi')
      return response
    } catch (error) {
      showError(error.response?.data?.message || 'QR kod yaratishda xatolik')
      throw error
    }
  }, [showSuccess, showError])

  const updateQRContent = useCallback(async (id, contentData) => {
    try {
      const response = await qrService.updateQRContent(id, contentData)
      showSuccess('Content muvaffaqiyatli yangilandi')
      
      // Update local state
      setQRs(prev => prev.map(qr => 
        qr._id === id ? { ...qr, ...response } : qr
      ))
      
      return response
    } catch (error) {
      showError(error.response?.data?.message || 'Content yangilashda xatolik')
      throw error
    }
  }, [showSuccess, showError])

  const deleteQR = useCallback(async (id) => {
    try {
      await qrService.deleteQR(id)
      showSuccess('QR kod o\'chirildi')
      
      // Update local state
      setQRs(prev => prev.map(qr => 
        qr._id === id ? { ...qr, status: 'deleted' } : qr
      ))
    } catch (error) {
      showError('QR kod o\'chirishda xatolik')
      throw error
    }
  }, [showSuccess, showError])

  const restoreQR = useCallback(async (id) => {
    try {
      await qrService.restoreQR(id)
      showSuccess('QR kod tiklandi')
      
      // Update local state
      setQRs(prev => prev.map(qr => 
        qr._id === id ? { ...qr, status: 'active' } : qr
      ))
    } catch (error) {
      showError('QR kod tiklashda xatolik')
      throw error
    }
  }, [showSuccess, showError])

  const refreshQRs = useCallback(() => {
    loadQRs()
  }, [loadQRs])

  return {
    qrs,
    loading,
    pagination,
    loadQRs,
    createQR,
    updateQRContent,
    deleteQR,
    restoreQR,
    refreshQRs,
    setPagination
  }
}