// pages/QRManagement.jsx - Debug versiyasi
import React, { useState } from 'react'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import QRList from '../components/qr/QRList'
import QRCreate from '../components/qr/QRCreate'
import QREdit from '../components/qr/QREdit'

const QRManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQR, setEditingQR] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateNew = () => {
    console.log('Creating new QR')
    setShowCreateModal(true)
  }

  const handleCreateSuccess = (newQR) => {
    console.log('QR created successfully:', newQR)
    setRefreshTrigger(prev => prev + 1)
    // Optionally, auto-open edit modal for the new QR
    if (newQR && newQR._id) {
      console.log('Auto-opening edit modal for new QR:', newQR._id)
      setEditingQR(newQR)
    }
  }

  const handleEdit = (qr) => {
    console.log('Edit QR requested:', qr)
    
    // QR obyektini tekshirish
    if (!qr) {
      console.error('No QR object provided to edit')
      alert('QR ma\'lumotlari topilmadi')
      return
    }
    
    if (!qr._id) {
      console.error('QR object has no _id:', qr)
      alert('QR kod ID topilmadi')
      return
    }
    
    console.log('Setting editing QR:', {
      id: qr._id,
      title: qr.title,
      status: qr.status,
      contentType: qr.contentType
    })
    
    setEditingQR(qr)
  }

  const handleEditSuccess = () => {
    console.log('QR edit successful')
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditClose = () => {
    console.log('Closing edit modal')
    setEditingQR(null)
  }

  // Debug: Current state logging
  console.log('QRManagement state:', {
    showCreateModal,
    editingQR: editingQR ? {
      id: editingQR._id,
      title: editingQR.title
    } : null,
    refreshTrigger
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header title="QR Kodlar Boshqaruvi" />
          
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <QRList 
              key={refreshTrigger}
              onCreateNew={handleCreateNew}
              onEdit={handleEdit}
            />
          </main>
        </div>
      </div>

      {/* Modals */}
      <QRCreate 
        isOpen={showCreateModal}
        onClose={() => {
          console.log('Closing create modal')
          setShowCreateModal(false)
        }}
        onSuccess={handleCreateSuccess}
      />

      <QREdit 
        isOpen={!!editingQR}
        onClose={handleEditClose}
        qr={editingQR}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

export default QRManagement