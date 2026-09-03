import { TrendingUp } from 'lucide-react'
import { Statistics } from './types'

interface StatisticsKPIProps {
  stats: Statistics
}

// Komponen kartu ringkasan Key Performance Indicators (KPI) utama
export default function StatisticsKPI({ stats }: StatisticsKPIProps) {
  const conversionRate =
    stats.totalRegistrations > 0
      ? (stats.approvedRegistrations / stats.totalRegistrations) * 100
      : 0
  const attendanceRate =
    stats.approvedRegistrations > 0
      ? (stats.attendedRegistrations / stats.approvedRegistrations) * 100
      : 0
  const paymentRate =
    stats.totalRegistrations > 0
      ? ((stats.paymentMethodStats.bca + stats.paymentMethodStats.dana) /
          stats.totalRegistrations) *
        100
      : 0

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-[#4B061A]" />
        Key Performance Indicators (KPI)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Pendaftar */}
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-2xl font-bold text-blue-900">{stats.totalRegistrations}</p>
          <p className="text-xs text-blue-600 mt-1">Total Pendaftar</p>
        </div>

        {/* Approval Rate */}
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-2xl font-bold text-green-900">{conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-green-600 mt-1">Approval Rate</p>
        </div>

        {/* Attendance Rate */}
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-2xl font-bold text-purple-900">{attendanceRate.toFixed(1)}%</p>
          <p className="text-xs text-purple-600 mt-1">Attendance Rate</p>
        </div>

        {/* Pending Review */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-900">{stats.pendingRegistrations}</p>
          <p className="text-xs text-yellow-600 mt-1">Pending Review</p>
        </div>

        {/* Payment Rate */}
        <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-2xl font-bold text-indigo-900">{paymentRate.toFixed(1)}%</p>
          <p className="text-xs text-indigo-600 mt-1">Payment Rate</p>
        </div>

        {/* Revenue (K) */}
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-2xl font-bold text-emerald-900">
            Rp{Math.round(stats.totalRevenue / 1000)}K
          </p>
          <p className="text-xs text-emerald-600 mt-1">Revenue (K)</p>
        </div>
      </div>
    </div>
  )
}
