import { AdminStats } from './types'

interface DashboardTopActivitiesProps {
  topActivities: AdminStats['topActivities']
}

// Komponen daftar kegiatan teratas dengan jumlah pendaftar tertinggi
export default function DashboardTopActivities({ topActivities }: DashboardTopActivitiesProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Kegiatan</h3>
        <div className="space-y-3">
          {topActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                <p className="text-xs text-gray-500">
                  {activity.registrationCount} / {activity.maxParticipants || '∞'} pendaftar
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activity.registrationOpen
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activity.registrationOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
