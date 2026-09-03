import { BarChart3, Calendar } from 'lucide-react'
import { Statistics } from './types'

interface StatisticsDemographicsProps {
  stats: Statistics
}

// Komponen sebaran demografi pendaftar berdasarkan fakultas dan angkatan
export default function StatisticsDemographics({ stats }: StatisticsDemographicsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribusi Fakultas */}
      {stats.facultyStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-[#4B061A]" />
            Distribusi Fakultas
          </h3>
          <div className="space-y-3">
            {stats.facultyStats.map((faculty) => {
              const percentage =
                stats.totalRegistrations > 0
                  ? (faculty.count / stats.totalRegistrations) * 100
                  : 0
              return (
                <div key={faculty.faculty} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{faculty.faculty}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#4B061A] h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-8">{faculty.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Distribusi Angkatan */}
      {stats.yearClassStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#4B061A]" />
            Distribusi Angkatan
          </h3>
          <div className="space-y-3">
            {stats.yearClassStats.map((yearClass) => {
              const percentage =
                stats.totalRegistrations > 0
                  ? (yearClass.count / stats.totalRegistrations) * 100
                  : 0
              return (
                <div key={yearClass.yearClass} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Angkatan {yearClass.yearClass}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 min-w-8">
                      {yearClass.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
