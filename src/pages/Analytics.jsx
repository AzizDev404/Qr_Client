// pages/Analytics.jsx
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

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [topQRs, setTopQRs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [searchTerm, setSearchTerm] = useState('')

  const { error: showError } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [statsData, qrData] = await Promise.all([
        qrService.getStats(),
        qrService.getQRs({ 
          page: 1, 
          limit: 10, 
          sortBy: 'scanCount',
          sortOrder: 'desc'
        })
      ])
      
      setStats(statsData)
      setTopQRs(qrData.qrs || [])
    } catch (error) {
      showError('Analytics ma\'lumotlarini yuklashda xatolik')
      console.error('Analytics load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value || 0}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const filteredTopQRs = topQRs.filter(qr =>
    qr.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header title="Analytics" />
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
          <Header title="Analytics & Statistika" />
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600">QR kodlar va scan statistikalari</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1d">Bugun</option>
                  <option value="7d">7 kun</option>
                  <option value="30d">30 kun</option>
                  <option value="90d">3 oy</option>
                  <option value="all">Barcha vaqt</option>
                </select>
                
                <button
                  onClick={loadAnalytics}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Yangilash</span>
                </button>
                
                <button className="btn-primary flex items-center space-x-2">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Jami QR Kodlar"
                value={stats?.totalQRs}
                change={5.2}
                icon={QrCode}
                color="blue"
              />
              <StatCard 
                title="Jami Skanlar"
                value={stats?.totalScans}
                change={12.5}
                icon={Eye}
                color="green"
              />
              <StatCard 
                title="Bugungi Skanlar"
                value={stats?.todayScans}
                change={-2.1}
                icon={Calendar}
                color="purple"
              />
              <StatCard 
                title="O'rtacha Scan/QR"
                value={stats?.totalQRs ? Math.round(stats.totalScans / stats.totalQRs) : 0}
                change={8.3}
                icon={BarChart3}
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing QRs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Eng Ko'p Skanlangan QR Kodlar
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="QR qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {filteredTopQRs.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {searchTerm ? 'QR kod topilmadi' : 'Hozircha statistika yo\'q'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTopQRs.map((qr, index) => (
                        <div key={qr._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                index === 2 ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{qr.title}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(qr.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {qr.scanCount || 0}
                            </div>
                            <div className="text-sm text-gray-500">scan</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    So'nggi Faollik
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Mock recent activity */}
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Yangi QR kod yaratildi</p>
                        <p className="text-xs text-gray-500">2 daqiqa oldin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">QR kod skanlandi</p>
                        <p className="text-xs text-gray-500">5 daqiqa oldin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Content yangilandi</p>
                        <p className="text-xs text-gray-500">10 daqiqa oldin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Fayl yuklandi</p>
                        <p className="text-xs text-gray-500">15 daqiqa oldin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">QR kod o'chirildi</p>
                        <p className="text-xs text-gray-500">1 soat oldin</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Barcha faollikni ko'rish
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Scan Trendi
                </h3>
              </div>
              
              <div className="p-6">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart integratsiyasi uchun Chart.js yoki Recharts ishlatishingiz mumkin</p>
                    <p className="text-sm text-gray-400 mt-2">Bu yerda scan trendi grafigi ko'rsatiladi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Type Distribution */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Content Turlari Bo'yicha Taqsimot
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.contentTypes?.text || 0}</div>
                    <div className="text-sm text-gray-600">Matn</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.contentTypes?.link || 0}</div>
                    <div className="text-sm text-gray-600">Havola</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📁</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.contentTypes?.file || 0}</div>
                    <div className="text-sm text-gray-600">Fayl</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.contentTypes?.contact || 0}</div>
                    <div className="text-sm text-gray-600">Kontakt</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Analytics