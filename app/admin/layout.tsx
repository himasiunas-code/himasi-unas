'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
} from 'lucide-react'
import {
  AdminHeader,
  AdminMobileDrawer,
  type AdminNavItem,
} from '@/components/shared/Admin/Layout'

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

  const navigation: AdminNavItem[] = [
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
      {/* Admin Header / Top Navigation */}
      <AdminHeader
        navigation={navigation}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onLogout={handleLogout}
      />

      {/* Mobile Menu Drawer */}
      <AdminMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onLogout={handleLogout}
      />

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