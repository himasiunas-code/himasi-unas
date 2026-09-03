import { AdminStats } from './types'
import { getStatusColor, getStatusIcon } from './statusHelpers'

interface DashboardStatusBreakdownProps {
  registrationsByStatus: AdminStats['registrationsByStatus']
}

// Komponen rincian status pendaftaran: menampilkan jumlah pendaftar berdasarkan statusnya
export default function DashboardStatusBreakdown({
  registrationsByStatus,
}: DashboardStatusBreakdownProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Pendaftaran</h3>
        <div className="space-y-3">
          {registrationsByStatus.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.status}</span>
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
