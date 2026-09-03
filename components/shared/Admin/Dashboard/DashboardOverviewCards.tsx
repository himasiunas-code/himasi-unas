import { Activity, Users, TrendingUp, Eye } from 'lucide-react'
import { AdminStats } from './types'

interface DashboardOverviewCardsProps {
  overview: AdminStats['overview']
}

// Komponen kartu ringkasan statistik (kegiatan, pendaftar, tren 7 hari, dan kegiatan terpublikasi)
export default function DashboardOverviewCards({ overview }: DashboardOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Kegiatan',
      value: overview.totalActivities,
      icon: Activity,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Pendaftar',
      value: overview.totalRegistrations,
      icon: Users,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: '7 Hari Terakhir',
      value: overview.recentRegistrations,
      icon: TrendingUp,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Kegiatan Published',
      value: overview.publishedActivities,
      icon: Eye,
      gradient: 'from-purple-500 to-indigo-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div
                    className={`h-12 w-12 bg-linear-to-r ${card.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                    <dd className="text-2xl font-bold text-gray-900">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
