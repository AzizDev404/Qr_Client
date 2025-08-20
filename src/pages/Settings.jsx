// pages/Settings.jsx
import React, { useState } from 'react'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import { useToast } from '../context/ToastContext'
import { 
  Settings as SettingsIcon, Save, Key, Database, 
  Globe, Shield, Bell, Download, Upload, Trash2
} from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [showBackupConfirm, setShowBackupConfirm] = useState(false)
  
  const { success: showSuccess, error: showError } = useToast()
  const API = import.meta.env.VITE_API_BASE_URL

  const [settings, setSettings] = useState({
    siteName: 'Dynamic QR System',
    baseUrl: API,
    maxFileSize: '100',
    allowedFileTypes: 'pdf,doc,jpg,png,mp4',
    emailNotifications: true,
    scanNotifications: false,
    backupFrequency: 'daily',
    retentionDays: '365'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
      showSuccess('Sozlamalar saqlandi')
    } catch (error) {
      showError('Sozlamalarni saqlashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleBackupData = async () => {
    try {
      // API call to create backup
      await new Promise(resolve => setTimeout(resolve, 2000)) // Mock delay
      showSuccess('Backup yaratildi va yuklab olindi')
    } catch (error) {
      showError('Backup yaratishda xatolik')
    }
  }

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: SettingsIcon },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sayt Nomi
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
          className="input-field"
          placeholder="Dynamic QR System"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base URL
        </label>
        <input
          type="url"
          value={settings.baseUrl}
          onChange={(e) => handleSettingChange('baseUrl', e.target.value)}
          className="input-field"
          placeholder="https://yourdomain.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          QR kodlar uchun asosiy URL manzil
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maksimal Fayl Hajmi (MB)
        </label>
        <input
          type="number"
          value={settings.maxFileSize}
          onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
          className="input-field"
          min="1"
          max="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ruxsat Etilgan Fayl Turlari
        </label>
        <input
          type="text"
          value={settings.allowedFileTypes}
          onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
          className="input-field"
          placeholder="pdf,doc,jpg,png,mp4"
        />
        <p className="mt-1 text-sm text-gray-500">
          Vergul bilan ajratilgan fayl kengaytmalari
        </p>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-yellow-600 mr-2" />
          <h4 className="text-sm font-medium text-yellow-800">
            Xavfsizlik Sozlamalari
          </h4>
        </div>
        <p className="mt-1 text-sm text-yellow-700">
          Bu sozlamalar tizim xavfsizligiga ta'sir qiladi. Ehtiyotkorlik bilan o'zgartiring.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Parolini O'zgartirish
        </label>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Joriy parol"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Yangi parol"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Yangi parolni tasdiqlash"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Login attempt limiting (5 ta noto'g'ri urinishdan keyin bloklash)
          </span>
        </label>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            defaultChecked
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            HTTPS majburiy (HTTP so'rovlarini HTTPS ga yo'naltirish)
          </span>
        </label>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Email Bildirishnomalar
          </span>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Yangi QR kod yaratilganda va muhim o'zgarishlarda email yuborish
        </p>
      </div>

      <div>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Scan Bildirishnomalar
          </span>
          <input
            type="checkbox"
            checked={settings.scanNotifications}
            onChange={(e) => handleSettingChange('scanNotifications', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Har bir QR kod skanlanganida bildirishnoma yuborish
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Email
        </label>
        <input
          type="email"
          className="input-field"
          placeholder="admin@example.com"
        />
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avtomatik Backup Chastotasi
        </label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
          className="input-field"
        >
          <option value="daily">Har kuni</option>
          <option value="weekly">Har hafta</option>
          <option value="monthly">Har oy</option>
          <option value="disabled">O'chiriq</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ma'lumotlar Saqlash Muddati (kun)
        </label>
        <input
          type="number"
          value={settings.retentionDays}
          onChange={(e) => handleSettingChange('retentionDays', e.target.value)}
          className="input-field"
          min="30"
          max="3650"
        />
        <p className="mt-1 text-sm text-gray-500">
          Eski backup fayllar avtomatik o'chiriladi
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Manual Backup
        </h4>
        <p className="text-sm text-blue-700 mb-4">
          Barcha QR kodlar, fayllar va sozlamalarning to'liq backup yarating
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBackupConfirm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Backup Yaratish</span>
          </button>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Upload size={16} />
            <span>Backup Yuklash</span>
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-red-900 mb-2">
          Xavfli Zona
        </h4>
        <p className="text-sm text-red-700 mb-4">
          Bu amallar qaytarib bo'lmaydigan o'zgarishlar kiritadi
        </p>
        <button className="btn-danger flex items-center space-x-2">
          <Trash2 size={16} />
          <span>Barcha Ma'lumotlarni O'chirish</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header title="Sozlamalar" />
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                          ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'backup' && renderBackupSettings()}

                {/* Save Button */}
                {activeTab !== 'backup' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Sozlamalarni Saqlash</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Backup Confirmation */}
      <ConfirmDialog
        isOpen={showBackupConfirm}
        onClose={() => setShowBackupConfirm(false)}
        onConfirm={handleBackupData}
        title="Backup Yaratish"
        message="Barcha ma'lumotlarning backup yaratiladi. Bu bir necha daqiqa vaqt olishi mumkin."
        confirmText="Backup Yaratish"
        variant="primary"
      />
    </div>
  )
}

export default Settings