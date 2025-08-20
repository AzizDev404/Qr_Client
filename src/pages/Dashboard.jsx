// pages/Dashboard.jsx - Key warnings hal qilingan
import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { qrService } from '../services/qrService'
import { useToast } from '../context/ToastContext'
import { 
  BarChart3, TrendingUp, Eye, QrCode, Calendar, 
  Download, RefreshCw, Filter, Search
} from 'lucide-react'
import { formatDate } from '../utils/helpers'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentQRs, setRecentQRs] = useState([])
  const [loading, setLoading] = useState(true)
  const { error: showError } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, qrData] = await Promise.all([
        qrService.getStats(),
        qrService.getQRs({ 
          page: 1, 
          limit: 5, 
          sortBy: 'scanCount',
          sortOrder: 'desc'
        })
      ])
      
      setStats(statsData)
      // Backend format handling
      setRecentQRs(qrData.qrs || qrData.data || qrData || [])
    } catch (error) {
      showError('Ma\'lumotlarni yuklashda xatolik')
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header title="Dashboard" />
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header title="Dashboard" />
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                key="total-qrs"
                title="Jami QR Kodlar"
                value={stats?.totalQRs}
                change={5.2}
                icon={QrCode}
                color="blue"
              />
              <StatCard 
                key="total-scans"
                title="Jami Skanlar"
                value={stats?.totalScans}
                change={12.5}
                icon={Eye}
                color="green"
              />
              <StatCard 
                key="active-qrs"
                title="Faol QR Kodlar"
                value={stats?.activeQRs}
                change={-2.1}
                icon={Calendar}
                color="purple"
              />
              <StatCard 
                key="today-scans"
                title="Bugungi Skanlar"
                value={stats?.todayScans}
                change={8.3}
                icon={BarChart3}
                color="orange"
              />
            </div>

            {/* Recent QRs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  So'nggi QR Kodlar
                </h3>
              </div>
              
              <div className="p-6">
                {recentQRs.length === 0 ? (
                  <div className="text-center py-8">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Hozircha QR kodlar yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentQRs.map(qr => {
                      // Backend format mapping
                      const qrId = qr.id || qr._id
                      const qrTitle = qr.title
                      const qrStatus = qr.isActive ? 'active' : 'deleted'
                      const qrContentType = qr.currentContent?.contentType || qr.contentType
                      const qrScanCount = qr.scanCount || 0
                      const qrCreatedAt = qr.createdDate || qr.createdAt
                      
                      return (
                        <div key={qrId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <QrCode className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{qrTitle}</h4>
                              <p className="text-sm text-gray-500">
                                {qrScanCount} scan • {qrCreatedAt ? new Date(qrCreatedAt).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {qrContentType && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {qrContentType === 'text' && '📝'}
                                {qrContentType === 'link' && '🔗'}
                                {qrContentType === 'file' && '📁'}
                                {qrContentType === 'contact' && '👤'}
                                {qrContentType}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              qrStatus === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {qrStatus === 'active' ? 'Faol' : 'O\'chirilgan'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tezkor Amallar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  key="quick-create"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <QrCode className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Yangi QR Yaratish</h4>
                  <p className="text-sm text-gray-500">Yangi dynamic QR kod yarating</p>
                </button>
                
                <button 
                  key="quick-analytics"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Eye className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Analytics Ko'rish</h4>
                  <p className="text-sm text-gray-500">Scan statistikalarini tekshiring</p>
                </button>
                
                <button 
                  key="quick-manage"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">QR Boshqarish</h4>
                  <p className="text-sm text-gray-500">Mavjud QR kodlarni tahrirlang</p>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard