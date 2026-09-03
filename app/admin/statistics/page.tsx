'use client'

import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import {
  Statistics,
  StatisticsHeader,
  StatisticsOverviewCards,
  StatisticsStatusBreakdown,
  StatisticsPaymentMethods,
  StatisticsDemographics,
  StatisticsKPI,
  StatisticsExecutiveSummary,
  exportStatisticsToCsv,
} from '@/components/shared/Admin/Statistics'
import { DashboardLoading } from '@/components/shared/Admin/Dashboard'

// Halaman utama Statistik & Analytics Admin HIMASI UNAS
export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Ambil data statistik saat pertama kali halaman dimuat
  useEffect(() => {
    fetchStatistics()
  }, [])

  // Fungsi pengambil data analitik dan keuangan dari API
  const fetchStatistics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/admin/statistics')
      if (response.ok) {
        const data = await response.json()
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Unduh rekap statistik dalam format file CSV
  const handleExport = () => {
    if (stats) exportStatisticsToCsv(stats)
  }

  // Tampilkan loading spinner saat memuat data
  if (loading) {
    return <DashboardLoading />
  }

  // Tampilkan pesan error jika data gagal diambil
  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Gagal memuat statistik</h3>
        <p className="mt-1 text-sm text-gray-500">Silakan refresh halaman</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header panel statistik */}
      <StatisticsHeader
        onRefresh={fetchStatistics}
        onExport={handleExport}
        refreshing={refreshing}
      />

      {/* Kartu metrik utama: Pendapatan, Pendaftar, Approval Rate, Attendance Rate */}
      <StatisticsOverviewCards stats={stats} />

      {/* Grid status pendaftaran dan metode pembayaran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rincian pendaftar berdasarkan status review */}
        <StatisticsStatusBreakdown stats={stats} />

        {/* Rincian dan persentase metode pembayaran */}
        <StatisticsPaymentMethods stats={stats} />
      </div>

      {/* Sebaran demografi fakultas dan angkatan mahasiswa */}
      <StatisticsDemographics stats={stats} />

      {/* Grid Key Performance Indicators (KPI) */}
      <StatisticsKPI stats={stats} />

      {/* Banner ringkasan eksekutif */}
      <StatisticsExecutiveSummary stats={stats} />
    </div>
  )
}