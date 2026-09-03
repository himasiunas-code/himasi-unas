import { DollarSign, Users, TrendingUp, Target } from 'lucide-react'
import { formatCurrency } from './utils'
import { Statistics } from './types'

interface StatisticsOverviewCardsProps {
  stats: Statistics
}

// Komponen kartu ringkasan metrik utama statistik dan performa keuangan
export default function StatisticsOverviewCards({ stats }: StatisticsOverviewCardsProps) {
  const conversionRate =
    stats.totalRegistrations > 0
      ? (stats.approvedRegistrations / stats.totalRegistrations) * 100
      : 0
  const attendanceRate =
    stats.approvedRegistrations > 0
      ? (stats.attendedRegistrations / stats.approvedRegistrations) * 100
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Pendapatan */}
      <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-green-600">Total Pendapatan</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stats.totalRegistrations} pendaftar × Rp 30.000
            </p>
          </div>
        </div>
      </div>

      {/* Total Pendaftar */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-blue-600">Total Pendaftar</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalRegistrations}</p>
            <p className="text-xs text-blue-600 mt-1">Sejak awal kegiatan</p>
          </div>
        </div>
      </div>

      {/* Tingkat Persetujuan (Approval Rate) */}
      <div className="bg-linear-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200 shadow-lg">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-purple-600">Tingkat Persetujuan</p>
            <p className="text-2xl font-bold text-purple-900">{conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-purple-600 mt-1">
              {stats.approvedRegistrations} dari {stats.totalRegistrations} pendaftar
            </p>
          </div>
        </div>
      </div>

      {/* Tingkat Kehadiran (Attendance Rate) */}
      <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-lg">
        <div className="flex items-center">
          <div className="shrink-0">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-orange-600">Tingkat Kehadiran</p>
            <p className="text-2xl font-bold text-orange-900">{attendanceRate.toFixed(1)}%</p>
            <p className="text-xs text-orange-600 mt-1">
              {stats.attendedRegistrations} dari {stats.approvedRegistrations} yang disetujui
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
