'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/shared/Navbar/Navbar'
import Footer from '@/components/shared/Footer/Footer'
import FloatingChatWidget from '@/components/shared/Chatbot/FloatingChatWidget'

interface AppLayoutShellProps {
  children: React.ReactNode
}

// Komponen pembungkus layout utama website:
// Menyembunyikan Navbar, Footer, dan Chatbot publik saat pengguna berada di halaman Admin (/admin)
export default function AppLayoutShell({ children }: AppLayoutShellProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // Jika halaman admin, render konten langsung tanpa Navbar dan Footer website publik
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Jika halaman publik, render lengkap dengan Navbar, Chatbot, dan Footer
  return (
    <div id="root-layout">
      <Navbar />
      {children}
      <FloatingChatWidget />
      <Footer />
    </div>
  )
}
