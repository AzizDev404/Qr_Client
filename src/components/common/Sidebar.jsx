// components/common/Sidebar.jsx
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, QrCode, BarChart3, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    // { path: '/qr-management', icon: QrCode, label: 'QR Kodlar' },
    // { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    // { path: '/settings', icon: Settings, label: 'Sozlamalar' } 
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 pt-16 lg:pt-6 pb-4">
            <div className="px-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900">QR Admin</h2>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Dynamic QR System v1.0
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Sidebar