'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  Activity,
  ChevronDown
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth')
        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.authenticated)
        } else {
          setIsAuthenticated(false)
          // Only redirect if not already on login page
          if (!pathname.includes('/admin/login')) {
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        if (!pathname.includes('/admin/login')) {
          router.push('/admin/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/auth', { 
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setIsAuthenticated(false)
        setProfileDropdownOpen(false)
        router.push('/admin/login')
      } else {
        console.error('Logout failed')
        alert('Logout gagal. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Terjadi error saat logout. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B061A] mx-auto mb-4"></div>
          <p className="text-gray-600">Tunggu Sebentar Yaa</p>
        </div>
      </div>
    )
  }

  // If on login page, don't show navbar
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  // If not authenticated and not on login page, redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B061A] mx-auto"></div>
        </div>
      </div>
    )
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/admin/dashboard'
    },
    {
      name: 'Pendaftaran',
      href: '/admin/registrations',
      icon: Users,
      current: pathname === '/admin/registrations'
    },
    {
      name: 'Kegiatan',
      href: '/admin/activities',
      icon: Activity,
      current: pathname === '/admin/activities'
    },
    {
      name: 'Statistik',
      href: '/admin/statistics',
      icon: BarChart3,
      current: pathname === '/admin/statistics'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 pt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo & Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="/icon/HIMASI.png"
                  alt="HIMASI Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <Image
                  src="/icon/FTKI.png"
                  alt="FTKI Logo"
                  width={32}
                  height={32}
                  className="h-8 w-16 ml-2"
                />
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-[#4B061A]">Admin HIMASI</h1>
                  <p className="text-xs text-gray-500">Management Panel</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        item.current
                          ? 'bg-[#4B061A] text-white shadow-lg'
                          : 'text-gray-700 hover:text-[#4B061A] hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`mr-2 h-4 w-4 ${
                        item.current ? 'text-white' : 'text-gray-500 group-hover:text-[#4B061A]'
                      }`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side - Profile & Actions */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {/* Back to Website */}
              <Link
                href="/"
                className="text-gray-500 hover:text-[#4B061A] px-3 py-2 text-sm font-medium transition-colors"
              >
                Kembali ke Website
              </Link>
              
              {/* Profile Dropdown - Only show if authenticated */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    disabled={isLoading}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B061A] p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#4B061A] flex items-center justify-center">
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <p className="font-medium">Administrator</p>
                          <p className="text-gray-500">admin@himasi.com</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Login: {new Date().toLocaleTimeString('id-ID')}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                          ) : (
                            <LogOut className="mr-2 h-4 w-4" />
                          )}
                          {isLoading ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu Admin</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-[#4B061A] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-white' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="border-t pt-4 mt-4">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kembali ke Website
                </Link>
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    disabled={isLoading}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-3"></div>
                    ) : (
                      <LogOut className="mr-3 h-5 w-5" />
                    )}
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Close dropdown when clicking outside */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  )
}