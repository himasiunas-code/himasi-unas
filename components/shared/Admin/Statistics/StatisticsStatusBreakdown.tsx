import { PieChart, Clock, UserCheck, UserX } from 'lucide-react'
import { Statistics } from './types'

interface StatisticsStatusBreakdownProps {
  stats: Statistics
}

// Komponen rincian jumlah pendaftaran berdasarkan status review
export default function StatisticsStatusBreakdown({ stats }: StatisticsStatusBreakdownProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-[#4B061A]" />
        Status Pendaftaran
      </h3>
      <div className="space-y-4">
        {/* Menunggu Review */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-3" />
            <span className="font-medium text-yellow-900">Menunggu Review</span>
          </div>
          <span className="text-xl font-bold text-yellow-900">{stats.pendingRegistrations}</span>
        </div>

        {/* Disetujui */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Disetujui</span>
          </div>
          <span className="text-xl font-bold text-green-900">{stats.approvedRegistrations}</span>
        </div>

        {/* Ditolak */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center">
            <UserX className="w-5 h-5 text-red-600 mr-3" />
            <span className="font-medium text-red-900">Ditolak</span>
          </div>
          <span className="text-xl font-bold text-red-900">{stats.rejectedRegistrations}</span>
        </div>

        {/* Hadir */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Hadir</span>
          </div>
          <span className="text-xl font-bold text-blue-900">{stats.attendedRegistrations}</span>
        </div>

        {/* Tidak Hadir */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <UserX className="w-5 h-5 text-gray-600 mr-3" />
            <span className="font-medium text-gray-900">Tidak Hadir</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{stats.absentRegistrations}</span>
        </div>
      </div>
    </div>
  )
}
