'use client'

import { useEffect, useState } from 'react'
import {
  DashboardHeader,
  DashboardOverviewCards,
  DashboardStatusBreakdown,
  DashboardTopActivities,
  DashboardRecentRegistrations,
  DashboardLoading,
  AdminStats,
} from '@/components/shared/Admin/Dashboard'

// Halaman utama Dashboard Admin HIMASI UNAS
export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Ambil data statistik dari API saat komponen pertama kali dimuat
  useEffect(() => {
    fetchStats()
  }, [])

  // Fungsi pengambil data statistik dashboard dari backend
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Tampilkan spinner loading saat data sedang dimuat
  if (loading) {
    return <DashboardLoading />
  }

  // Tampilkan pesan error jika data gagal dimuat
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Gagal memuat data statistik.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header banner dengan status sistem dan tanggal */}
      <DashboardHeader />

      {/* Kartu ringkasan metrik statistik utama */}
      <DashboardOverviewCards overview={stats.overview} />

      {/* Grid status pendaftaran dan kegiatan terpopuler */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Rincian pendaftaran berdasarkan status */}
        <DashboardStatusBreakdown registrationsByStatus={stats.registrationsByStatus} />

        {/* Daftar kegiatan dengan jumlah pendaftar terbanyak */}
        <DashboardTopActivities topActivities={stats.topActivities} />
      </div>

      {/* Tabel daftar pendaftaran terbaru */}
      <DashboardRecentRegistrations latestRegistrations={stats.latestRegistrations} />
    </div>
  )
}