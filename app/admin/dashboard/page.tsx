'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye
} from 'lucide-react'

interface AdminStats {
  overview: {
    totalActivities: number
    publishedActivities: number
    totalRegistrations: number
    recentRegistrations: number
  }
  registrationsByStatus: Array<{
    status: string
    count: number
  }>
  registrationTrend: Array<{
    date: string
    count: number
  }>
  topActivities: Array<{
    id: string
    title: string
    slug: string
    registrationCount: number
    maxParticipants: number | null
    registrationOpen: boolean
  }>
  latestRegistrations: Array<{
    id: string
    fullName: string
    email: string
    status: string
    createdAt: string
    activityTitle: string
    activitySlug: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'REJECTED':
        return 'text-red-600 bg-red-100'
      case 'ATTENDED':
        return 'text-blue-600 bg-blue-100'
      case 'ABSENT':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B061A]"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="mt-2 text-gray-600">Overview statistik dan aktivitas terbaru HIMASI</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              System Online
            </div>
            <span>|</span>
            <div>
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Kegiatan</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.overview.totalActivities}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 bg-linear-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Pendaftar</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.overview.totalRegistrations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 bg-linear-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">7 Hari Terakhir</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.overview.recentRegistrations}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-12 w-12 bg-linear-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Kegiatan Published</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.overview.publishedActivities}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Status Breakdown */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Pendaftaran</h3>
            <div className="space-y-3">
              {stats.registrationsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
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

        {/* Top Activities */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="px-6 py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Kegiatan</h3>
            <div className="space-y-3">
              {stats.topActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.registrationCount} / {activity.maxParticipants || '∞'} pendaftar
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.registrationOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.registrationOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Pendaftaran Terbaru</h3>
            <a
              href="/admin/registrations"
              className="text-sm font-medium text-[#4B061A] hover:text-[#3A0514]"
            >
              Lihat semua
            </a>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.latestRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {registration.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.activityTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusIcon(registration.status)}
                        <span className="ml-1">{registration.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}